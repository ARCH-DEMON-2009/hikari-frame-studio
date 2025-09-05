import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customer, items, paymentMethod } = await req.json();
    
    console.log('Creating order with:', { customer, items, paymentMethod });

    // Create Supabase client with service role for database operations
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get user ID from auth header if available
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabaseClient.auth.getUser(token);
        userId = data.user?.id || null;
      } catch (error) {
        console.log('No valid auth token provided, proceeding as guest');
      }
    }

    // Fetch shipping settings from database
    const { data: settings } = await supabaseService
      .from('settings')
      .select('key, value')
      .in('key', ['shipping_cost', 'free_shipping_threshold', 'cod_charge']);
    
    const settingsMap = {};
    settings?.forEach(setting => {
      settingsMap[setting.key] = parseFloat(setting.value);
    });
    
    // Calculate pricing
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Apply shipping based on settings
    const shippingCost = settingsMap.shipping_cost || 50;
    const freeShippingThreshold = settingsMap.free_shipping_threshold || 1000;
    const codChargeAmount = settingsMap.cod_charge || 30;
    
    const deliveryCharge = subtotal >= freeShippingThreshold ? 0 : shippingCost;
    const codCharge = paymentMethod === 'COD' ? codChargeAmount : 0;
    
    // Apply discount for 5+ frames
    let discountAmount = 0;
    const totalFrames = items
      .filter(item => item.category?.toLowerCase().includes('frame'))
      .reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalFrames >= 5) {
      discountAmount = 50;
    }
    
    const total = subtotal + deliveryCharge + codCharge - discountAmount;

    // Create order in database
    const orderData = {
      user_id: userId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      address_line1: customer.address,
      payment_method: paymentMethod,
      subtotal,
      delivery_charge: deliveryCharge,
      cod_charge: codCharge,
      discount_amount: discountAmount,
      total,
      status: 'PLACED'
    };

    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Created order:', order);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId || null,
      title: item.name,
      category: item.category,
      image_url: item.image,
      unit_price: item.price,
      qty: item.quantity
    }));

    const { error: itemsError } = await supabaseService
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    // Handle Razorpay for online payments
    if (paymentMethod === 'RAZORPAY') {
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
      
      console.log('Razorpay credentials check:', { 
        keyId: razorpayKeyId ? 'present' : 'missing',
        keySecret: razorpayKeySecret ? 'present' : 'missing'
      });
      
      if (!razorpayKeyId || !razorpayKeySecret) {
        throw new Error('Razorpay credentials not configured properly');
      }

      // Create Razorpay order
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          receipt: `order_rcpt_${order.id}`
        })
      });

      const responseText = await razorpayResponse.text();
      console.log('Razorpay API response status:', razorpayResponse.status);
      console.log('Razorpay API response:', responseText);

      if (!razorpayResponse.ok) {
        throw new Error(`Failed to create Razorpay order: ${responseText}`);
      }

      const razorpayOrder = JSON.parse(responseText);
      console.log('Razorpay order created:', razorpayOrder);


      // Update order with Razorpay order ID
      const { error: updateError } = await supabaseService
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', order.id);

      if (updateError) {
        console.error('Error updating order with Razorpay ID:', updateError);
        throw new Error('Failed to update order with payment details');
      }

      return new Response(JSON.stringify({ 
        success: true, 
        orderId: order.id,
        razorpayOrder: razorpayOrder,
        discountApplied: discountAmount > 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // COD - return order details
    return new Response(JSON.stringify({ 
      success: true, 
      orderId: order.id,
      discountApplied: discountAmount > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in create-order function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
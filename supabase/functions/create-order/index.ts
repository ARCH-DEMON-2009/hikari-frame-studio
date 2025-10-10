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
    const { customer, items, paymentMethod, total, subtotal, deliveryCharge, codCharge, discountAmount } = await req.json();
    
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

    interface CartItem {
      price: number;
      quantity: number;
      category?: string;
      productId?: string;
      name: string;
      image: string;
    }

    // Create Razorpay order if payment method is ONLINE
    let razorpayOrderId = null;
    if (paymentMethod === 'ONLINE') {
      const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
      const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
      
      if (!razorpayKeyId || !razorpayKeySecret) {
        throw new Error('Razorpay credentials not configured');
      }

      // Create Razorpay order
      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Convert to paise
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: customer.name,
            customer_email: customer.email
          }
        })
      });

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        console.error('Razorpay order creation failed:', errorData);
        throw new Error('Failed to create payment order');
      }

      const razorpayOrder = await razorpayResponse.json();
      razorpayOrderId = razorpayOrder.id;
      console.log('Razorpay order created:', razorpayOrderId);
    }

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
      status: paymentMethod === 'ONLINE' ? 'PENDING' : 'PLACED',
      payment_status: paymentMethod === 'ONLINE' ? 'PENDING' : 'COD',
      razorpay_order_id: razorpayOrderId
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
    const orderItems = (items as CartItem[]).map((item: CartItem) => ({
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

    // Return order details with Razorpay order ID for online payment
    return new Response(JSON.stringify({ 
      success: true, 
      orderId: order.id,
      razorpayOrderId: razorpayOrderId,
      discountApplied: discountAmount > 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in create-order function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
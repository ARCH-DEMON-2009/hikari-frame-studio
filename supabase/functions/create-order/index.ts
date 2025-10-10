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
    
    interface SettingsMap {
      shipping_cost?: number;
      free_shipping_threshold?: number;
      cod_charge?: number;
    }
    
    const settingsMap: SettingsMap = {};
    settings?.forEach(setting => {
      settingsMap[setting.key as keyof SettingsMap] = parseFloat(setting.value);
    });
    
    interface CartItem {
      price: number;
      quantity: number;
      category?: string;
      productId?: string;
      name: string;
      image: string;
    }
    
    // Calculate pricing
    const subtotal = (items as CartItem[]).reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    
    // Apply shipping based on settings
    const shippingCost = settingsMap.shipping_cost || 50;
    const freeShippingThreshold = settingsMap.free_shipping_threshold || 1000;
    const codChargeAmount = settingsMap.cod_charge || 30;
    
    const deliveryCharge = subtotal >= freeShippingThreshold ? 0 : shippingCost;
    const codCharge = paymentMethod === 'COD' ? codChargeAmount : 0;
    
    // Apply discount for 5+ frames
    let discountAmount = 0;
    const totalFrames = (items as CartItem[])
      .filter((item: CartItem) => item.category?.toLowerCase().includes('frame'))
      .reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    
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

    // Only COD orders are processed now - online payment coming soon
    if (paymentMethod !== 'COD') {
      throw new Error('Only Cash on Delivery is available at the moment. Online payment coming soon.');
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
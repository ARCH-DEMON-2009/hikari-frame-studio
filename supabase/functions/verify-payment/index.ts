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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
    
    console.log('Verifying payment:', { razorpay_payment_id, razorpay_order_id });

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    // Verify signature
    const crypto = await import('node:crypto');
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Invalid signature verification');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid payment signature' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client with service role
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find and update the order
    const { data: order, error: fetchError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (fetchError || !order) {
      console.error('Order not found:', fetchError);
      throw new Error('Order not found');
    }

    // Update payment details
    const { error: updateError } = await supabaseService
      .from('orders')
      .update({
        payment_status: 'PAID',
        razorpay_payment_id,
        razorpay_signature,
        status: 'PROCESSING'
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log('Payment verified and order updated successfully');

    return new Response(JSON.stringify({ 
      success: true,
      orderId: order.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
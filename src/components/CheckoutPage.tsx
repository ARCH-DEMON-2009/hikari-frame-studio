
import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadScript } from '@/lib/utils'; React, { useState } from 'react';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 99 : 0;
  const codFee = paymentMethod === 'COD' ? 100 : 0;
  const discountAmount = 0; // Calculate based on business logic
  const total = subtotal + shipping + codFee - discountAmount;

    useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js');
  }, []);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData = {
        customer: customerInfo,
        items: items,
        paymentMethod: paymentMethod,
        total: total
      };

      const authHeaders = user ? {
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      } : {};

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData,
        headers: authHeaders
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      if (paymentMethod === 'RAZORPAY' && data.razorpayOrder) {
        // Check if Razorpay is loaded
        if (!(window as any).Razorpay) {
          throw new Error('Razorpay SDK failed to load');
        }

        // Initialize Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Get from environment variable
          amount: data.razorpayOrder.amount,
          currency: data.razorpayOrder.currency,
          name: 'Hikari Frame Studio',
          description: `Order #${data.orderId}`,
          order_id: data.razorpayOrder.id,
          handler: async function (response: any) {
            try {
              const verifyData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              const { error: verifyError, data: verifyResponse } = await supabase.functions.invoke('verify-payment', {
                body: verifyData
              });

              if (verifyError || !verifyResponse?.success) {
                throw new Error(verifyError?.message || 'Payment verification failed');
              }

              clearCart();
              toast({
                title: "Order Placed Successfully!",
                description: "You will receive a confirmation email shortly",
              });
              navigate('/orders');
            } catch (error) {
              console.error('Payment verification failed:', error);
              toast({
                title: "Payment Verification Failed",
                description: "Please try again or contact support",
                variant: "destructive",
              });
            }
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              toast({
                title: "Payment Cancelled",
                description: "You can try again or choose a different payment method",
                variant: "default",
              });
            }
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone
          },
          theme: {
            color: '#4F46E5'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          toast({
            title: "Payment Failed",
            description: response.error.description || "Please try again or choose a different payment method",
            variant: "destructive",
          });
          setIsProcessing(false);
        });
        
        rzp.open();
      } else {
        // COD Order
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: "Your order will be delivered in 3-5 business days",
        });
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Checkout
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cart
              </span>
              <div className="w-8 h-0.5 bg-blush-300"></div>
              <span className="flex items-center gap-1 text-blush-300">
                <div className="w-4 h-4 rounded-full bg-blush-300"></div>
                Checkout
              </span>
              <div className="w-8 h-0.5 bg-cream-200"></div>
              <span className="text-charcoal-400">Order Complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card className="card-elegant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-charcoal-600" />
                  <h3 className="font-display font-semibold text-charcoal-700">
                    Shipping Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="+91 98765 43210" 
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Complete Address</Label>
                    <Input 
                      id="address" 
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      placeholder="123 Main Street, City, State, Pincode" 
                      required 
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="card-elegant p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-charcoal-600" />
                  <h3 className="font-display font-semibold text-charcoal-700">
                    Payment Method
                  </h3>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-cream-200 rounded-lg">
                      <RadioGroupItem value="RAZORPAY" id="razorpay" />
                      <label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="font-medium text-charcoal-700">Online Payment</div>
                        <div className="text-sm text-charcoal-600">
                          Pay securely with card, UPI, or net banking via Razorpay
                        </div>
                      </label>
                      <div className="text-green-600 font-medium">Recommended</div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-cream-200 rounded-lg">
                      <RadioGroupItem value="COD" id="cod" />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-medium text-charcoal-700">Cash on Delivery</div>
                        <div className="text-sm text-charcoal-600">
                          Pay when your order is delivered (Additional ₹100 fee)
                        </div>
                      </label>
                    </div>
                  </div>
                </RadioGroup>
              </Card>

              {/* Security Notice */}
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Secure Checkout</div>
                  <div className="text-sm text-green-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="card-elegant p-6 sticky top-8">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">
                  Order Summary
                </h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-charcoal-700">{item.name}</div>
                        {item.customization && (
                          <div className="text-sm text-charcoal-600">
                            {item.customization.frameStyle && `Frame: ${item.customization.frameStyle}`}
                            {item.customization.size && `, Size: ${item.customization.size}`}
                          </div>
                        )}
                        <div className="text-sm text-charcoal-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t border-cream-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Shipping</span>
                    <span className="font-medium">₹{shipping}</span>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">COD Fee</span>
                      <span className="font-medium">₹{codFee}</span>
                    </div>
                  )}
                  <div className="border-t border-cream-200 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-charcoal-700">₹{total}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  className="btn-primary w-full mt-6"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cream-100 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order - ₹${total}`
                  )}
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm text-charcoal-600">
                    Expected delivery: 3-5 business days
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

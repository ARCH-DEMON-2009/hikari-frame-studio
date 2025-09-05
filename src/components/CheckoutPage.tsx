import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    shippingCost: 50,
    freeShippingThreshold: 1000,
    codCharge: 30
  });

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('key, value')
          .in('key', ['shipping_cost', 'free_shipping_threshold', 'cod_charge']);
        
        if (data) {
          const settingsMap = data.reduce((acc, setting) => {
            acc[setting.key] = parseFloat(setting.value);
            return acc;
          }, {} as any);
          
          setSettings({
            shippingCost: settingsMap.shipping_cost || 50,
            freeShippingThreshold: settingsMap.free_shipping_threshold || 1000,
            codCharge: settingsMap.cod_charge || 30
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Pre-fill user info if logged in
  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const subtotal = getTotalPrice();
  const deliveryCharge = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCost;
  const codCharge = paymentMethod === 'COD' ? settings.codCharge : 0;
  
  // Apply discount for 5+ frames
  let discountAmount = 0;
  const totalFrames = items
    .filter(item => item.category?.toLowerCase().includes('frame'))
    .reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalFrames >= 5) {
    discountAmount = 50;
  }
  
  const total = subtotal + deliveryCharge + codCharge - discountAmount;

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

    if (paymentMethod === 'ONLINE') {
      toast({
        title: "Coming Soon",
        description: "Online payment will be available soon. Please use Cash on Delivery for now.",
        variant: "default",
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

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order will be delivered in 3-5 business days",
      });
      navigate('/orders');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: error?.message || "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/cart">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Checkout
            </h1>
            <p className="text-charcoal-600">
              Complete your order details below
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card className="card-elegant p-6">
                <h2 className="font-display font-semibold text-charcoal-700 mb-4">
                  <Shield className="inline w-5 h-5 mr-2" />
                  Customer Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      disabled={!!user?.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter complete delivery address"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="card-elegant p-6">
                <h2 className="font-display font-semibold text-charcoal-700 mb-4">
                  <CreditCard className="inline w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border border-cream-200 rounded-lg">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-charcoal-600">
                            Pay when your order arrives (₹{settings.codCharge} additional charge)
                          </div>
                        </div>
                        <Truck className="w-5 h-5 text-charcoal-400" />
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border border-cream-200 rounded-lg opacity-60">
                    <RadioGroupItem value="ONLINE" id="online" disabled />
                    <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Online Payment</div>
                          <div className="text-sm text-charcoal-600">
                            PhonePe Payment Gateway - Coming Soon
                          </div>
                        </div>
                        <CreditCard className="w-5 h-5 text-charcoal-400" />
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="card-elegant p-6">
                <h2 className="font-display font-semibold text-charcoal-700 mb-4">
                  Order Summary
                </h2>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-cream-200 last:border-b-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded bg-cream-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        {item.customization && (
                          <p className="text-xs text-charcoal-600">
                            {item.customization.frameStyle && `Frame: ${item.customization.frameStyle}`}
                            {item.customization.size && `, Size: ${item.customization.size}`}
                          </p>
                        )}
                        <p className="text-sm font-medium">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">
                      Delivery Charge
                      {subtotal >= settings.freeShippingThreshold && (
                        <span className="text-green-600 text-sm ml-1">(Free!)</span>
                      )}
                    </span>
                    <span className="font-medium">₹{deliveryCharge}</span>
                  </div>
                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">COD Charge</span>
                      <span className="font-medium">₹{codCharge}</span>
                    </div>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>5+ Frames Discount</span>
                      <span className="font-medium">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-cream-200 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-charcoal-700">₹{total}</span>
                    </div>
                  </div>
                </div>

                {subtotal < settings.freeShippingThreshold && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ₹{settings.freeShippingThreshold - subtotal} more for free delivery!
                    </p>
                  </div>
                )}

                <Button
                  className="btn-primary w-full mt-6"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Place Order - ₹{total}
                    </>
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-charcoal-500">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </div>
              </Card>

              {/* Security Info */}
              <Card className="card-elegant p-6">
                <h3 className="font-medium text-charcoal-700 mb-3">
                  <Shield className="inline w-4 h-4 mr-2" />
                  Secure Checkout
                </h3>
                <div className="text-sm text-charcoal-600 space-y-2">
                  <div>• SSL encrypted secure payments</div>
                  <div>• 100% secure personal information</div>
                  <div>• Easy returns and refunds</div>
                  <div>• 24/7 customer support</div>
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
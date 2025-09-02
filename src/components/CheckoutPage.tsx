
import React, { useState } from 'react';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const orderItems = [
    { name: "Classic Wooden Frame", price: 899, quantity: 1, customization: "8x10 inches" },
    { name: "Botanical Wall Sticker", price: 599, quantity: 2 }
  ];

  const subtotal = 2097;
  const shipping = 99;
  const codFee = paymentMethod === 'cod' ? 100 : 0;
  const total = subtotal + shipping + codFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or show success message
      console.log('Order placed successfully!');
    }, 2000);
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
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" className="input-elegant" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" className="input-elegant" placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="input-elegant" placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" className="input-elegant" placeholder="+91 98765 43210" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" className="input-elegant" placeholder="123 Main Street" />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" className="input-elegant" placeholder="Mumbai" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" className="input-elegant" placeholder="400001" />
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
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <label htmlFor="razorpay" className="flex-1 cursor-pointer">
                        <div className="font-medium text-charcoal-700">Online Payment</div>
                        <div className="text-sm text-charcoal-600">
                          Pay securely with card, UPI, or net banking via Razorpay
                        </div>
                      </label>
                      <div className="text-green-600 font-medium">Recommended</div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-cream-200 rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
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
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-charcoal-700">{item.name}</div>
                        {item.customization && (
                          <div className="text-sm text-charcoal-600">{item.customization}</div>
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
                  {paymentMethod === 'cod' && (
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

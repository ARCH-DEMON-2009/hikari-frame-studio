
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: string;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Classic Wooden Frame",
      price: 899,
      quantity: 1,
      image: "/api/placeholder/100/100",
      customization: "8x10 inches, Custom Photo"
    },
    {
      id: 2,
      name: "Botanical Wall Sticker",
      price: 599,
      quantity: 2,
      image: "/api/placeholder/100/100"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 99;
  const codFee = 100; // Cash on Delivery fee
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Shopping Cart
            </h1>
            <p className="text-charcoal-600">
              Review your items before proceeding to checkout
            </p>
          </div>

          {cartItems.length === 0 ? (
            <Card className="card-elegant p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold text-charcoal-700 mb-2">
                Your cart is empty
              </h2>
              <p className="text-charcoal-600 mb-6">
                Start shopping to add items to your cart
              </p>
              <Button className="btn-primary">
                Continue Shopping
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="card-elegant p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg bg-cream-200"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-charcoal-700 mb-1">
                          {item.name}
                        </h3>
                        {item.customization && (
                          <p className="text-sm text-charcoal-600 mb-2">
                            {item.customization}
                          </p>
                        )}
                        <p className="text-lg font-bold text-charcoal-700">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="card-elegant p-6">
                  <h3 className="font-display font-semibold text-charcoal-700 mb-4">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">Shipping</span>
                      <span className="font-medium">₹{shipping}</span>
                    </div>
                    <div className="border-t border-cream-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-charcoal-700">₹{total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button className="btn-primary w-full">
                      Proceed to Checkout
                    </Button>
                    <div className="text-center">
                      <p className="text-sm text-charcoal-600">
                        Cash on Delivery available
                      </p>
                      <p className="text-xs text-charcoal-500">
                        (Additional ₹{codFee} COD fee applies)
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Payment Methods */}
                <Card className="card-elegant p-6">
                  <h4 className="font-medium text-charcoal-700 mb-3">
                    We Accept
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-charcoal-600">
                    <div>• Credit/Debit Cards</div>
                    <div>• UPI Payments</div>
                    <div>• Net Banking</div>
                    <div>• Cash on Delivery</div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;


import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Hero from '@/components/Hero';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  const products = [
    {
      id: 1,
      name: "Classic Wooden Frame",
      price: 899,
      image: "/api/placeholder/300/300",
      category: "frames",
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Modern Metal Frame",
      price: 1299,
      image: "/api/placeholder/300/300",
      category: "frames",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Botanical Wall Sticker",
      price: 599,
      image: "/api/placeholder/300/300",
      category: "stickers",
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: "Vintage Poster Print",
      price: 799,
      image: "/api/placeholder/300/300",
      category: "posters",
      rating: 4.6,
      reviews: 67
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-display font-bold text-charcoal-700">
                Hikari
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-charcoal-600 hover:text-charcoal-700 transition-colors">Frames</a>
              <a href="#" className="text-charcoal-600 hover:text-charcoal-700 transition-colors">Wall Stickers</a>
              <a href="#" className="text-charcoal-600 hover:text-charcoal-700 transition-colors">Posters</a>
              <a href="#" className="text-charcoal-600 hover:text-charcoal-700 transition-colors">Custom</a>
            </div>

            {/* Search and Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="input-elegant pl-10 pr-4 py-2 w-64"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blush-300 text-charcoal-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-cream-200 animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <input
                type="text"
                placeholder="Search products..."
                className="input-elegant w-full"
              />
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-charcoal-600 hover:text-charcoal-700 py-2">Frames</a>
                <a href="#" className="text-charcoal-600 hover:text-charcoal-700 py-2">Wall Stickers</a>
                <a href="#" className="text-charcoal-600 hover:text-charcoal-700 py-2">Posters</a>
                <a href="#" className="text-charcoal-600 hover:text-charcoal-700 py-2">Custom</a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-cream-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Featured Products
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium photo frames, artistic wall stickers, and beautiful posters to transform your space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="btn-primary">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-blush-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-elegant p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🖼️</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal-700 mb-2">Photo Frames</h3>
              <p className="text-charcoal-600 mb-4">Premium frames in various styles and sizes</p>
              <Button variant="outline" className="btn-secondary">Shop Frames</Button>
            </div>

            <div className="card-elegant p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal-700 mb-2">Wall Stickers</h3>
              <p className="text-charcoal-600 mb-4">Artistic decals to personalize your walls</p>
              <Button variant="outline" className="btn-secondary">Shop Stickers</Button>
            </div>

            <div className="card-elegant p-8 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gold-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📜</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-charcoal-700 mb-2">Posters</h3>
              <p className="text-charcoal-600 mb-4">Curated collection of art and photography prints</p>
              <Button variant="outline" className="btn-secondary">Shop Posters</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-700 text-cream-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4">Hikari</h3>
              <p className="text-cream-200 mb-4">
                Transform your space with our premium collection of frames, wall art, and decor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-cream-200">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Photo Frames</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Wall Stickers</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Posters</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Custom Orders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-cream-200">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-cream-200">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-charcoal-600 mt-8 pt-8 text-center text-cream-200">
            <p>&copy; 2024 Hikari. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

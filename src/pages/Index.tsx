import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User, LogOut, Wrench, MessageSquare, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      
      // Randomize and limit to 6 products
      const shuffled = data?.sort(() => 0.5 - Math.random()) || [];
      const randomProducts = shuffled.slice(0, 6);
      
      // Transform database products to match expected format
      const transformedProducts = randomProducts.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        category: Array.isArray(product.category) ? product.category[0] : product.category || 'Uncategorized',
        rating: 4.5, // Default rating
        reviews: Math.floor(Math.random() * 100) + 10 // Random review count
      }));
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category');

      if (error) throw error;
      
      // Extract unique categories from array or string values (trim spaces)
      const uniqueCategories = new Set();
      data?.forEach(item => {
        if (Array.isArray(item.category)) {
          item.category.forEach(cat => {
            if (cat) uniqueCategories.add(cat.trim());
          });
        } else if (item.category) {
          uniqueCategories.add(item.category.trim());
        }
      });
      
      setCategories(Array.from(uniqueCategories).filter(Boolean));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[hsl(var(--background)/0.95)] backdrop-blur-xl border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 group">
                <span className="text-3xl md:text-4xl font-anime font-bold text-transparent bg-gradient-to-r from-[hsl(var(--anime-red))] to-[hsl(var(--neon-teal))] bg-clip-text uppercase tracking-wider">
                  Hikari
                </span>
                <Sparkles className="w-6 h-6 text-[hsl(var(--neon-teal))] group-hover:animate-pulse" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products?category=Frame" className="text-muted-foreground hover:text-[hsl(var(--neon-teal))] transition-all font-medium uppercase tracking-wide text-sm">Frames</Link>
              <Link to="/products?category=Posters" className="text-muted-foreground hover:text-[hsl(var(--neon-teal))] transition-all font-medium uppercase tracking-wide text-sm">Posters</Link>
              <Link to="/products?category=Wall Stickers" className="text-muted-foreground hover:text-[hsl(var(--neon-teal))] transition-all font-medium uppercase tracking-wide text-sm">Stickers</Link>
              <Link to="/customize" className="text-muted-foreground hover:text-[hsl(var(--anime-red))] transition-all font-medium uppercase tracking-wide text-sm">Custom</Link>
            </div>

            {/* Search and Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const searchTerm = e.currentTarget.value.trim();
                      if (searchTerm) {
                        navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                      }
                    }
                  }}
                />
              </div>
              <Heart className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Link>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/orders">
                      <User className="w-4 h-4 mr-1" />
                      Orders
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
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
          <div className="md:hidden bg-background border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-input rounded-md"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const searchTerm = e.currentTarget.value.trim();
                    if (searchTerm) {
                      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                    }
                  }
                }}
              />
              <div className="flex flex-col space-y-2">
                <Link to="/products?category=Frame" className="text-foreground hover:text-primary py-2">Frames</Link>
                <Link to="/products?category=Wall Stickers" className="text-foreground hover:text-primary py-2">Wall Stickers</Link>
                <Link to="/products?category=Posters" className="text-foreground hover:text-primary py-2">Posters</Link>
                <Link to="/customize" className="text-foreground hover:text-primary py-2">Custom</Link>
              </div>
              
              {/* Mobile Cart and Wishlist */}
              <div className="flex items-center justify-center space-x-6 pt-2 border-t">
                <Heart className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Link to="/cart" className="relative flex items-center">
                  <ShoppingCart className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                  <span className="ml-2">Cart</span>
                </Link>
              </div>
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Button variant="outline" size="sm" asChild className="justify-start">
                    <Link to="/orders">
                      <User className="w-4 h-4 mr-2" />
                      Orders
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" asChild className="justify-start">
                      <Link to="/admin">Admin</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleSignOut} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-[hsl(var(--deep-navy))] to-[hsl(var(--navy-light))]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/customize" className="group">
            <div className="card-premium p-8 h-full flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
              <Wrench className="w-12 h-12 mb-4 text-[hsl(var(--neon-teal))] group-hover:rotate-12 transition-transform" />
              <h3 className="text-xl font-display font-bold uppercase tracking-wider mb-2">Customize Your Product</h3>
              <p className="text-muted-foreground text-sm">Upload your favorite anime art</p>
            </div>
          </Link>
          <Link to="/request-product" className="group">
            <div className="card-premium p-8 h-full flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
              <MessageSquare className="w-12 h-12 mb-4 text-[hsl(var(--anime-red))] group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-display font-bold uppercase tracking-wider mb-2">Request a Product</h3>
              <p className="text-muted-foreground text-sm">Can't find what you need? Tell us!</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-[hsl(var(--background))] to-[hsl(var(--deep-navy))] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-anime font-bold text-foreground mb-6 uppercase tracking-wider">
              <span className="text-transparent bg-gradient-to-r from-[hsl(var(--anime-red))] to-[hsl(var(--neon-teal))] bg-clip-text">
                Premium Collection
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked anime posters, framed wall art, and collectibles for true otaku
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-muted animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12" id="products">
            <Button asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-[hsl(var(--deep-navy))]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-anime font-bold text-foreground mb-6 uppercase tracking-wider">
              <span className="text-transparent bg-gradient-to-r from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-teal))] bg-clip-text">
                Shop by Category
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              // Category emoji mapping
              const categoryEmojis = {
                'frame': '🖼️',
                'sticker': '🎨',
                'poster': '📜',
                'anime figures': '🎭',
                'collectible': '⭐',
                'dc': '🦸',
                'marvel': '🦸‍♂️',
                'movies': '🎬',
                'new arrivals': '🆕'
              };
              
              const emoji = categoryEmojis[category.toLowerCase()] || '🛍️';
              
              return (
                <div 
                  key={index}
                  className="card-premium p-8 text-center group cursor-pointer hover:scale-105 transition-all"
                  onClick={() => navigate(`/products?category=${encodeURIComponent(category)}`)}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[hsl(var(--anime-red))] to-[hsl(var(--neon-teal))] rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-[0_0_20px_hsl(var(--neon-teal)/0.3)]">
                    <span className="text-4xl">{emoji}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-3 uppercase tracking-wider">{category}</h3>
                  <Button className="btn-premium text-xs w-full">
                    Explore
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] text-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-anime font-bold mb-4 uppercase text-transparent bg-gradient-to-r from-[hsl(var(--anime-red))] to-[hsl(var(--neon-teal))] bg-clip-text">Hikari</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Light up your world with premium anime posters, framed art, and collectibles. For true otaku, by true fans.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/hikari2108202/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg flex items-center justify-center hover:border-[hsl(var(--neon-teal))] hover:shadow-[0_0_15px_hsl(var(--neon-teal)/0.3)] transition-all">
                  <span className="text-[hsl(var(--neon-teal))]">📷</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 uppercase tracking-wider text-sm">Products</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/products?category=Posters" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Anime Posters</Link></li>
                <li><Link to="/products?category=Frame" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Framed Art</Link></li>
                <li><Link to="/products?category=Wall Stickers" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Wall Stickers</Link></li>
                <li><Link to="/customize" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Custom Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="#" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Fast Shipping</Link></li>
                <li><Link to="#" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Returns Policy</Link></li>
                <li><Link to="#" className="hover:text-[hsl(var(--neon-teal))] transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-6 uppercase tracking-wider text-sm">Trust</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(var(--premium-gold))]">⭐</span>
                  <span>4.9/5 Rating</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(var(--neon-teal))]">✓</span>
                  <span>Authentic Products</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(var(--anime-red))]">🚀</span>
                  <span>Fast Delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(var(--neon-pink))]">🔒</span>
                  <span>Secure Checkout</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[hsl(var(--border))] mt-12 pt-8 text-center text-muted-foreground">
            <p className="text-sm">&copy; 2025 Hikari - Light Up Your World with Anime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
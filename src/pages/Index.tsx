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
  const [categories, setCategories] = useState<{name: string, image: string}[]>([]);
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
        .select('category, images');

      if (error) throw error;
      
      // Extract unique categories with their first product image
      const categoryMap = new Map<string, string>();
      data?.forEach(item => {
        const categories = Array.isArray(item.category) ? item.category : [item.category];
        const image = item.images?.[0] || '/placeholder.svg';
        
        categories.forEach(cat => {
          if (cat && !categoryMap.has(cat.trim())) {
            categoryMap.set(cat.trim(), image);
          }
        });
      });
      
      const categoriesWithImages = Array.from(categoryMap.entries()).map(([name, image]) => ({
        name,
        image
      }));
      
      setCategories(categoriesWithImages);
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
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-3xl font-anime font-black premium-text-gradient uppercase tracking-tight">
                  HIKARI
                </span>
                <Sparkles className="w-5 h-5 text-anime-red" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/products?category=Frame" className="text-foreground hover:text-primary transition-colors">Frames</Link>
              <Link to="/products?category=Wall Stickers" className="text-foreground hover:text-primary transition-colors">Wall Stickers</Link>
              <Link to="/products?category=Posters" className="text-foreground hover:text-primary transition-colors">Posters</Link>
              <Link to="/customize" className="text-foreground hover:text-primary transition-colors">Custom</Link>
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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/customize">
            <div className="card-premium p-6 h-full hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-anime-red to-anime-red-dark rounded-lg flex items-center justify-center group-hover:neon-glow-red transition-all">
                  <Wrench className="w-7 h-7 text-premium-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-anime font-bold text-lg uppercase tracking-wide mb-1">Customize</h3>
                  <p className="text-sm text-muted-foreground">Create your own design</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/request-product">
            <div className="card-premium p-6 h-full hover:scale-105 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-neon-teal to-neon-teal-dark rounded-lg flex items-center justify-center group-hover:neon-glow-teal transition-all">
                  <MessageSquare className="w-7 h-7 text-deep-navy" />
                </div>
                <div className="text-left">
                  <h3 className="font-anime font-bold text-lg uppercase tracking-wide mb-1">Request</h3>
                  <p className="text-sm text-muted-foreground">Can't find it? Ask us!</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-anime font-black text-foreground mb-4 uppercase">
              Featured <span className="premium-text-gradient">Collection</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Premium anime art, collectibles & wall decor for passionate fans
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
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-anime font-black text-foreground mb-4 uppercase">
              Shop by <span className="premium-text-gradient">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg">Explore our curated collections</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="card-premium group cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/50 to-transparent opacity-80"></div>
                  
                  {/* Category Name on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-anime font-bold text-premium-white mb-2 capitalize uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-anime-red/90 text-premium-white border-anime-red hover:bg-anime-red hover:text-premium-white transition-all group-hover:neon-glow-red"
                    >
                      Explore →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-deep-navy to-midnight text-premium-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-3xl font-anime font-black premium-text-gradient uppercase">Hikari</h3>
                <Sparkles className="w-5 h-5 text-neon-teal" />
              </div>
              <p className="text-premium-gray mb-6 leading-relaxed">
                Your ultimate destination for premium anime art, collectibles, and wall decor. Light up your world with anime.
              </p>
              <a 
                href="https://www.instagram.com/hikari.in_?igsh=MWZvcGV6dGhwbjR0cg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-neon-teal hover:text-neon-teal-light transition-colors font-semibold"
              >
                Follow us on Instagram →
              </a>
            </div>
            <div>
              <h4 className="font-anime font-bold mb-6 text-lg uppercase tracking-wide">Products</h4>
              <ul className="space-y-3 text-premium-gray">
                <li><Link to="/products?category=Frame" className="hover:text-anime-red transition-colors">Anime Frames</Link></li>
                <li><Link to="/products?category=Posters" className="hover:text-anime-red transition-colors">Posters</Link></li>
                <li><Link to="/products?category=Wall Stickers" className="hover:text-anime-red transition-colors">Wall Stickers</Link></li>
                <li><Link to="/customize" className="hover:text-anime-red transition-colors">Custom Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-anime font-bold mb-6 text-lg uppercase tracking-wide">Support</h4>
              <ul className="space-y-3 text-premium-gray">
                <li><Link to="#" className="hover:text-neon-teal transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-neon-teal transition-colors">Shipping Info</Link></li>
                <li><Link to="#" className="hover:text-neon-teal transition-colors">Returns Policy</Link></li>
                <li><Link to="#" className="hover:text-neon-teal transition-colors">Track Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-anime font-bold mb-6 text-lg uppercase tracking-wide">Trust</h4>
              <ul className="space-y-3 text-premium-gray">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-teal rounded-full"></div>
                  <span>Secure Payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-anime-red rounded-full"></div>
                  <span>Premium Quality</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                  <span>Fast Shipping</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-pink rounded-full"></div>
                  <span>100% Authentic</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate/30 mt-12 pt-8 text-center text-premium-gray">
            <p className="font-medium">&copy; 2025 Hikari. All rights reserved. Made with ❤️ for anime fans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
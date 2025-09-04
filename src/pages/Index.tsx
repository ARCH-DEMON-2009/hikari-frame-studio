import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(6);

      if (error) throw error;
      
      // Transform database products to match expected format
      const transformedProducts = data?.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        category: product.category || 'Uncategorized',
        rating: 4.5, // Default rating
        reviews: Math.floor(Math.random() * 100) + 10 // Random review count
      })) || [];
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
              <Link to="/" className="text-2xl font-bold text-primary">
                Hikari
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="#" className="text-foreground hover:text-primary transition-colors">Frames</Link>
              <Link to="#" className="text-foreground hover:text-primary transition-colors">Wall Stickers</Link>
              <Link to="#" className="text-foreground hover:text-primary transition-colors">Posters</Link>
              <Link to="#" className="text-foreground hover:text-primary transition-colors">Custom</Link>
            </div>

            {/* Search and Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
              />
              <div className="flex flex-col space-y-2">
                <Link to="#" className="text-foreground hover:text-primary py-2">Frames</Link>
                <Link to="#" className="text-foreground hover:text-primary py-2">Wall Stickers</Link>
                <Link to="#" className="text-foreground hover:text-primary py-2">Posters</Link>
                <Link to="#" className="text-foreground hover:text-primary py-2">Custom</Link>
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

      {/* Featured Products */}
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked collection of premium photo frames, artistic wall stickers, and beautiful posters to transform your space.
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
            <Button>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 text-center group cursor-pointer rounded-lg border hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🖼️</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Photo Frames</h3>
              <p className="text-muted-foreground mb-4">Premium frames in various styles and sizes</p>
              <Button variant="outline" asChild>
                <Link to="/#products">Shop Frames</Link>
              </Button>
            </div>

            <div className="bg-card p-8 text-center group cursor-pointer rounded-lg border hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Wall Stickers</h3>
              <p className="text-muted-foreground mb-4">Artistic decals to personalize your walls</p>
              <Button variant="outline" asChild>
                <Link to="/#products">Shop Stickers</Link>
              </Button>
            </div>

            <div className="bg-card p-8 text-center group cursor-pointer rounded-lg border hover:shadow-elegant transition-all">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📜</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Posters</h3>
              <p className="text-muted-foreground mb-4">Curated collection of art and photography prints</p>
              <Button variant="outline" asChild>
                <Link to="/#products">Shop Posters</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Hikari</h3>
              <p className="text-muted-foreground mb-4">
                Transform your space with our premium collection of frames, wall art, and decor.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Photo Frames</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Wall Stickers</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Posters</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Custom Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Returns</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Size Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Instagram</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Facebook</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Pinterest</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Newsletter</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Hikari. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
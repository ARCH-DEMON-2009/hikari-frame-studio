import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Menu, X, User, LogOut, Wrench, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ProductSearch } from '../components/ProductSearch';
import { NewsletterSignup } from '../components/NewsletterSignup';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
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
      const categoryMap = new Map();
      data?.forEach(item => {
        const cats = Array.isArray(item.category) ? item.category : [item.category];
        const image = item.images?.[0] || '/placeholder.svg';
        
        cats.forEach(cat => {
          if (cat && !categoryMap.has(cat.trim())) {
            categoryMap.set(cat.trim(), image);
          }
        });
      });
      
      setCategories(
        Array.from(categoryMap.entries()).map(([name, image]) => ({ name, image }))
      );
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
              <Link to="/" className="text-2xl font-bold text-primary">
                Hikari
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
              <div className="w-64">
                <ProductSearch />
              </div>
              <Link to="/wishlist" className="relative">
                <Heart className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Link>
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
              <ProductSearch />
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <Link to="/customize">
            <Button variant="outline" className="w-full h-20 text-lg">
              <Wrench className="w-6 h-6 mr-2" />
              Customize Your Product
            </Button>
          </Link>
          <Link to="/request-product">
            <Button variant="outline" className="w-full h-20 text-lg">
              <MessageSquare className="w-6 h-6 mr-2" />
              Request a Product
            </Button>
          </Link>
        </div>
      </div>

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
            <Button asChild>
              <Link to="/products">View All Products</Link>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="aspect-square relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-500 transition-all duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <h3 className="text-lg font-display font-semibold text-cream-50 mb-2 capitalize">{category.name}</h3>
                  <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-4 py-2 bg-gold-500 text-charcoal-700 rounded-lg font-medium text-sm hover:bg-gold-600 transition-colors">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-md mx-auto md:mx-0">
            <NewsletterSignup />
          </div>
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
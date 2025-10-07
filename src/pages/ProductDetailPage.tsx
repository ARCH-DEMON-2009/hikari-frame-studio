import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star, Plus, Minus, Share, Truck, Shield, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ShareButton from '@/components/ShareButton';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      // Try to fetch by slug first, then by ID if slug doesn't work
      let query = supabase.from('products').select('*');
      
      // Check if slug is actually an ID (UUID format)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      
      if (isUUID) {
        query = query.eq('id', slug);
      } else {
        query = query.eq('slug', slug);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        console.error('Error fetching product:', error);
        throw new Error('Product not found');
      }
      
      const transformedProduct = {
        id: data.id,
        name: data.title,
        price: data.price,
        images: data.images || ['/placeholder.svg'],
        category: data.category || 'Uncategorized',
        description: data.description || 'No description available',
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        meesho_link: data.meesho_link,
        amazon_link: data.amazon_link,
      };
      
      setProduct(transformedProduct);
      
      // Add to recently viewed
      addToRecentlyViewed({
        id: data.id,
        title: data.title,
        price: data.price,
        images: data.images || ['/placeholder.svg'],
        slug: data.slug
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive",
      });
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} added to your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0],
      category: product.category
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    });
  };

  const handleCustomize = () => {
    navigate('/customize', { state: { product } });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-12 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Product not found</p>
            <Button asChild className="mt-4">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/products" className="hover:text-foreground">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">{product.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <Badge variant="secondary" className="w-fit">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-foreground">
              ₹{product.price}
              <span className="text-sm text-muted-foreground font-normal ml-2">
                + shipping
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
              
              {/* External Marketplace Links */}
              {(product.meesho_link || product.amazon_link) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Also available on:</p>
                  <div className="flex gap-2">
                    {product.meesho_link && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(product.meesho_link, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buy on Meesho
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      disabled
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Amazon (Coming Soon)
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className="flex-1"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  {isInWishlist(product.id) ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
                <ShareButton 
                  title={product.name}
                  description={product.description}
                />
              </div>

              {product.category?.toLowerCase().includes('frame') && (
                <Button
                  onClick={handleCustomize}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Customize with Your Image
                </Button>
              )}
            </div>

            {/* Features */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders above ₹1000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-sm text-muted-foreground">Premium materials only</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-muted-foreground">Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
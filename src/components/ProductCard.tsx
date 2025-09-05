import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCustomize = () => {
    navigate('/customize', { state: { product } });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleProductClick = () => {
    // Use slug if available, otherwise use ID
    const identifier = product.slug || product.id;
    navigate(`/product/${identifier}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="card-elegant p-4 group cursor-pointer animate-fade-in flex gap-4"
        onClick={handleProductClick}
      >
        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-cream-200 to-blush-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <h3 className="font-display font-semibold text-charcoal-700">{product.name}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist();
              }}
              className={`p-2 rounded-full transition-all duration-300 ${
                isWishlisted 
                  ? 'bg-blush-300 text-charcoal-700' 
                  : 'hover:bg-blush-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-charcoal-600 capitalize">{product.category}</p>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-gold-500 fill-current'
                      : 'text-cream-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-charcoal-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-charcoal-700">₹{product.price}</span>
            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="btn-primary text-sm"
              >
                Add to Cart
              </Button>
              {product.category?.toLowerCase().includes('frame') && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCustomize();
                  }}
                  variant="secondary"
                  className="text-sm"
                >
                  Customize
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card-elegant p-4 group cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Product Image */}
      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-cream-200 to-blush-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist();
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isWishlisted 
              ? 'bg-blush-300 text-charcoal-700' 
              : 'bg-white/70 text-charcoal-600 hover:bg-blush-200'
          }`}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isWishlisted ? 'fill-current' : ''
            }`} 
          />
        </button>

        {/* Action Buttons */}
        <div className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              className="flex-1 btn-primary text-sm py-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
            {product.category?.toLowerCase().includes('frame') && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomize();
                }}
                variant="secondary"
                className="text-sm py-2"
              >
                Customize
              </Button>
            )}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/80 backdrop-blur-sm text-charcoal-600 text-xs px-2 py-1 rounded-full font-medium capitalize">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-charcoal-700 group-hover:text-charcoal-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-gold-500 fill-current'
                    : 'text-cream-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-charcoal-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-charcoal-700">
            ₹{product.price}
          </span>
          <span className="text-sm text-charcoal-500">
            + shipping
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
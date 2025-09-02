
import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    console.log('Added to cart:', product.name);
    // TODO: Implement cart functionality
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="card-elegant p-4 group cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* Quick Add Button */}
        <div className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            className="w-full btn-primary text-sm py-2"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
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

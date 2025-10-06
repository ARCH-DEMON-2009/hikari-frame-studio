
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-cream-100 via-blush-100 to-cream-200 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-gold-500 rounded-lg rotate-12"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-blush-300 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gold-400 rounded-lg rotate-45 opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-cream-200">
              <Sparkles className="w-4 h-4 text-gold-500 mr-2" />
              <span className="text-sm text-charcoal-600 font-medium">New Collection Available</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-charcoal-700 mb-6 leading-tight">
              Frame Your
              <span className="text-transparent bg-gradient-to-r from-blush-300 to-gold-500 bg-clip-text"> Memories</span>
            </h1>
            
            <p className="text-lg text-charcoal-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Discover premium photo frames, artistic wall stickers, and beautiful posters. 
              Upload your own images and create personalized decor that tells your story.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-primary group" asChild>
                <Link to="/customize">
                  Customize Now
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" className="btn-secondary" asChild>
                <Link to="/products">Browse Collection</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-charcoal-700">10K+</div>
                <div className="text-sm text-charcoal-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-charcoal-700">500+</div>
                <div className="text-sm text-charcoal-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-charcoal-700">4.9★</div>
                <div className="text-sm text-charcoal-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10 animate-scale-in">
              <div className="card-elegant p-8 max-w-md mx-auto">
                <div className="aspect-square bg-gradient-to-br from-cream-200 to-blush-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl">🖼️</div>
                </div>
                <h3 className="font-display font-semibold text-charcoal-700 mb-2">Custom Photo Frame</h3>
                <p className="text-charcoal-600 text-sm mb-4">Upload your image and see the magic happen</p>
                <Button className="btn-gold w-full" asChild>
                  <Link to="/customize">Try It Now</Link>
                </Button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold-400 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blush-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

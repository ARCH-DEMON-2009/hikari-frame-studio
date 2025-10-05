import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--deep-navy))] to-[hsl(var(--navy-light))] py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[hsl(var(--neon-teal))] rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[hsl(var(--anime-red))] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[hsl(var(--neon-pink))] rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center bg-gradient-to-r from-[hsl(var(--anime-red)/0.2)] to-[hsl(var(--neon-teal)/0.2)] backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-[hsl(var(--neon-teal)/0.3)]">
              <Sparkles className="w-5 h-5 text-[hsl(var(--neon-teal))] mr-2 animate-pulse" />
              <span className="text-sm text-[hsl(var(--neon-teal))] font-bold uppercase tracking-wider">Premium Anime Collection</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-anime font-bold text-foreground mb-6 leading-tight uppercase">
              Light Up Your
              <span className="block text-transparent bg-gradient-to-r from-[hsl(var(--anime-red))] via-[hsl(var(--neon-pink))] to-[hsl(var(--neon-teal))] bg-clip-text neon-glow-teal"> 
                Anime World
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Premium posters, framed wall art, and collectible figures for true otaku. 
              <span className="text-[hsl(var(--neon-teal))] font-semibold"> Transform your space into an anime sanctuary.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button className="btn-primary group text-lg h-14" asChild>
                <Link to="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button className="btn-premium text-lg h-14" asChild>
                <Link to="/customize">
                  <Zap className="mr-2 w-5 h-5" />
                  Customize Now
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 bg-[hsl(var(--card))] px-4 py-3 rounded-lg border border-[hsl(var(--border))]">
                <Shield className="w-5 h-5 text-[hsl(var(--neon-teal))]" />
                <span className="text-sm font-medium">Authentic Products</span>
              </div>
              <div className="flex items-center gap-2 bg-[hsl(var(--card))] px-4 py-3 rounded-lg border border-[hsl(var(--border))]">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--anime-red))]" />
                <span className="text-sm font-medium">10K+ Happy Fans</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative z-10 animate-scale-in">
              {/* Featured Product Card */}
              <div className="card-premium p-8 max-w-md mx-auto relative">
                {/* Neon Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--anime-red))] via-[hsl(var(--neon-pink))] to-[hsl(var(--neon-teal))] rounded-xl blur-sm opacity-50"></div>
                
                <div className="relative bg-[hsl(var(--card))] rounded-lg p-6">
                  <div className="aspect-square bg-gradient-to-br from-[hsl(var(--navy-lighter))] to-[hsl(var(--deep-navy))] rounded-lg mb-6 flex items-center justify-center border-2 border-[hsl(var(--neon-teal)/0.3)] overflow-hidden relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]"></div>
                    <div className="text-8xl z-10">🎭</div>
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2 text-xl uppercase tracking-wider">Premium Anime Poster</h3>
                  <p className="text-muted-foreground text-sm mb-4">Museum-quality prints • Frame included</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-[hsl(var(--premium-gold))]">★</span>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">(4.9)</span>
                    </div>
                    <span className="text-2xl font-bold text-[hsl(var(--neon-teal))]">₹499</span>
                  </div>
                  <Button className="btn-secondary w-full" asChild>
                    <Link to="/products">
                      Shop Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-[hsl(var(--neon-teal))] rounded-lg opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[hsl(var(--anime-red))] rounded-lg opacity-20 blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { value: '10K+', label: 'Happy Otaku' },
            { value: '500+', label: 'Anime Products' },
            { value: '4.9★', label: 'Customer Rating' },
            { value: '24/7', label: 'Fast Shipping' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-[hsl(var(--card)/0.5)] backdrop-blur-sm rounded-lg border border-[hsl(var(--border))] hover:border-[hsl(var(--neon-teal)/0.5)] transition-all">
              <div className="text-3xl md:text-4xl font-display font-bold text-transparent bg-gradient-to-r from-[hsl(var(--anime-red))] to-[hsl(var(--neon-teal))] bg-clip-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;

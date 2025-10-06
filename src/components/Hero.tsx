
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-deep-navy via-midnight to-slate py-24 overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--anime-red) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-teal) / 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Glowing Accents */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-anime-red/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-teal/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center bg-anime-red/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border-2 border-anime-red/30">
              <Sparkles className="w-5 h-5 text-neon-teal mr-2 animate-pulse" />
              <span className="text-sm text-premium-white font-semibold uppercase tracking-wider">Light Up Your World</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-anime font-black text-premium-white mb-6 leading-tight uppercase">
              Premium
              <span className="block premium-text-gradient text-6xl md:text-7xl lg:text-8xl">Anime Art</span>
            </h1>
            
            <p className="text-lg md:text-xl text-premium-gray mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
              Curated collection of high-quality anime posters, framed wall art, and collectible figures. 
              <span className="text-neon-teal font-bold"> For true otaku, by true otaku.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Button className="btn-primary group shadow-2xl" asChild>
                <Link to="/products">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button className="btn-secondary" asChild>
                <Link to="/customize">Customize Frame</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mt-12 text-premium-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-teal rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Fast Global Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-anime-red rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Hero Showcase */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-scale-in">
              <div className="card-premium p-6 max-w-md mx-auto backdrop-blur-sm bg-white/5">
                <div className="aspect-square bg-gradient-to-br from-anime-red/20 to-neon-teal/20 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden border-2 border-anime-red/30">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                  <div className="text-8xl z-10 drop-shadow-2xl filter brightness-110">🎨</div>
                </div>
                <h3 className="font-anime font-bold text-premium-white mb-3 text-xl uppercase tracking-wide">
                  Premium Frames
                </h3>
                <p className="text-premium-gray text-sm mb-5 font-medium">
                  Museum-quality framing for your favorite anime art
                </p>
                <Button className="btn-premium w-full text-sm" asChild>
                  <Link to="/customize">Customize Now →</Link>
                </Button>
              </div>
            </div>
            
            {/* Neon Accents */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-neon-teal rounded-lg opacity-20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-anime-red rounded-lg opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SearchResult {
  id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
}

export const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, images, slug')
        .ilike('title', `%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleResultClick = (slug: string) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 input-elegant"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-elegant z-50 max-h-96 overflow-y-auto">
            {results.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => handleResultClick(product.slug)}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{product.title}</p>
                  <p className="text-sm text-muted-foreground">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

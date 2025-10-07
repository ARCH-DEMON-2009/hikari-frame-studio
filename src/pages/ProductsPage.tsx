import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import QuickViewModal from '@/components/QuickViewModal';
import { useSearchParams, Link, useLocation } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState(['all']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get category from URL params or location state
  const urlCategory = searchParams.get('category') || location.state?.category;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (urlCategory) {
      setCategoryFilter(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, sortBy, categoryFilter, selectedCategories, priceRange]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      
      const transformedProducts = data?.map(product => ({
        id: product.id,
        slug: product.slug,
        name: product.title,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        category: product.category,
        categoryArray: Array.isArray(product.category) ? product.category : [product.category || 'Uncategorized'],
        rating: 4.5,
        reviews: Math.floor(Math.random() * 100) + 10,
        description: product.description,
        images: product.images || ['/placeholder.svg']
      })) || [];
      
      // Extract unique categories (keep original case)
      const uniqueCategories = new Set(['all']);
      transformedProducts.forEach(product => {
        product.categoryArray.forEach(cat => {
          if (cat) uniqueCategories.add(cat);
        });
      });
      setCategories(Array.from(uniqueCategories));
      
      // Calculate max price
      if (transformedProducts.length > 0) {
        const max = Math.max(...transformedProducts.map(p => p.price));
        setMaxPrice(max);
        setPriceRange([0, max]);
      }
      
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products;

    // Filter by category (case-insensitive and trim spaces)
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.categoryArray.some(cat => 
          cat.trim().toLowerCase() === categoryFilter.trim().toLowerCase()
        )
      );
    }
    
    // Filter by selected categories from sidebar
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        product.categoryArray.some(cat =>
          selectedCategories.some(selected => 
            cat.trim().toLowerCase() === selected.trim().toLowerCase()
          )
        )
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryArray.some(cat => cat.trim().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Check URL search params
    const urlSearchTerm = searchParams.get('search');
    if (urlSearchTerm && !searchTerm) {
      setSearchTerm(urlSearchTerm);
      return;
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return 0; // Keep original order
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortBy('newest');
    setCategoryFilter('all');
    setSearchTerm('');
  };
  
  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const getCategoryDisplayName = (category: string) => {
    if (category === 'all') return 'All Products';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getCategoryDisplayName(categoryFilter)}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Main Content with Filters Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <ProductFilters
              categories={categories.filter(c => c !== 'all')}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
              maxPrice={maxPrice}
              sortBy={sortBy}
              onCategoryChange={handleCategoryToggle}
              onPriceChange={setPriceRange}
              onSortChange={setSortBy}
              onReset={handleResetFilters}
            />
          </div>
          
          {/* Products Area */}
          <div className="lg:col-span-3">
            {/* Search and View Mode */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(category => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button
                      onClick={() => handleCategoryToggle(category)}
                      className="ml-1 hover:bg-background rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:bg-background rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard 
                      product={product}
                      viewMode={viewMode}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleQuickView(product)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
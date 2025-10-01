import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [autoFillEnabled, setAutoFillEnabled] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    slug: '',
    // Anime figure specific fields
    characterName: '',
    seriesName: '',
    figureHeight: '',
    material: '',
    manufacturer: '',
    releaseDate: '',
    limitedEdition: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || '',
      images: product.images || [],
      slug: product.slug || '',
      characterName: '',
      seriesName: '',
      figureHeight: '',
      material: '',
      manufacturer: '',
      releaseDate: '',
      limitedEdition: false,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      images: [],
      slug: '',
      characterName: '',
      seriesName: '',
      figureHeight: '',
      material: '',
      manufacturer: '',
      releaseDate: '',
      limitedEdition: false,
    });
    setShowForm(true);
  };

  const handleImagesChange = async (newImages: string[]) => {
    let finalImages = newImages;
    
    // If this is a frame product and we just added the first image, add the default frame images
    if (formData.category?.toLowerCase().includes('frame') && formData.images.length === 0 && newImages.length > 0) {
      finalImages = [...newImages, '/frame1.jpg', '/frame2.jpg'];
    }
    
    setFormData({ ...formData, images: finalImages });
    
    // Auto-fill if enabled and we have images
    if (autoFillEnabled && newImages.length > 0 && !formData.title) {
      await autoFillProductDetails(newImages[0]);
    }
  };

  const autoFillProductDetails = async (imageUrl: string) => {
    if (!imageUrl || autoFilling) return;
    
    setAutoFilling(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-fill-product', {
        body: { imageUrl }
      });

      if (error) throw error;

      if (data) {
        setFormData(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          slug: data.slug || prev.slug,
        }));

        toast({
          title: "Auto-fill Complete",
          description: "Product details have been generated from the image.",
        });
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
      toast({
        title: "Auto-fill Error",
        description: "Failed to generate product details. Please fill manually.",
        variant: "destructive",
      });
    } finally {
      setAutoFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Build description with anime figure details if applicable
      let finalDescription = formData.description;
      if (formData.category.toLowerCase().includes('anime') || 
          formData.category.toLowerCase().includes('figure') ||
          formData.category.toLowerCase().includes('collectible')) {
        const details = [];
        if (formData.characterName) details.push(`Character: ${formData.characterName}`);
        if (formData.seriesName) details.push(`Series: ${formData.seriesName}`);
        if (formData.figureHeight) details.push(`Height: ${formData.figureHeight}cm`);
        if (formData.material) details.push(`Material: ${formData.material}`);
        if (formData.manufacturer) details.push(`Manufacturer: ${formData.manufacturer}`);
        if (formData.releaseDate) details.push(`Release Date: ${formData.releaseDate}`);
        if (formData.limitedEdition) details.push('Limited Edition');
        
        if (details.length > 0) {
          finalDescription = `${formData.description}\n\n${details.join(' • ')}`;
        }
      }

      const productData = {
        title: formData.title,
        slug: formData.slug,
        description: finalDescription,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully.",
        });
      }

      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Auto-fill Toggle */}
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Switch
                  id="auto-fill"
                  checked={autoFillEnabled}
                  onCheckedChange={setAutoFillEnabled}
                />
                <Label htmlFor="auto-fill" className="text-sm">
                  Auto-fill product details from uploaded images
                </Label>
                {autoFilling && (
                  <span className="text-xs text-muted-foreground ml-2">
                    Generating details...
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Product title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="product-url-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Frame, Anime Figure, Collectible"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use "Anime Figure" or "Collectible" for detailed figure options
                </p>
              </div>

              {/* Anime Figure Specific Fields */}
              {(formData.category.toLowerCase().includes('anime') || 
                formData.category.toLowerCase().includes('figure') ||
                formData.category.toLowerCase().includes('collectible')) && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-sm">Anime Figure Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="characterName">Character Name</Label>
                      <Input
                        id="characterName"
                        value={formData.characterName}
                        onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
                        placeholder="e.g., Naruto Uzumaki"
                      />
                    </div>

                    <div>
                      <Label htmlFor="seriesName">Series/Anime Name</Label>
                      <Input
                        id="seriesName"
                        value={formData.seriesName}
                        onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                        placeholder="e.g., Naruto Shippuden"
                      />
                    </div>

                    <div>
                      <Label htmlFor="figureHeight">Height/Size (cm)</Label>
                      <Input
                        id="figureHeight"
                        type="number"
                        value={formData.figureHeight}
                        onChange={(e) => setFormData({ ...formData, figureHeight: e.target.value })}
                        placeholder="e.g., 25"
                      />
                    </div>

                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        placeholder="e.g., PVC, ABS"
                      />
                    </div>

                    <div>
                      <Label htmlFor="manufacturer">Manufacturer</Label>
                      <Input
                        id="manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        placeholder="e.g., Good Smile Company"
                      />
                    </div>

                    <div>
                      <Label htmlFor="releaseDate">Release Date</Label>
                      <Input
                        id="releaseDate"
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="limitedEdition"
                        checked={formData.limitedEdition}
                        onCheckedChange={(checked) => setFormData({ ...formData, limitedEdition: checked })}
                      />
                      <Label htmlFor="limitedEdition">Limited Edition</Label>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="images">Images</Label>
                <ImageUpload
                  images={formData.images}
                  onChange={handleImagesChange}
                  maxImages={5}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(product)}
                  className="h-8 w-8"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.images.length > 0 && (
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold">₹{product.price}</p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No products found. Create your first product!</p>
        </div>
      )}
    </div>
  );
};
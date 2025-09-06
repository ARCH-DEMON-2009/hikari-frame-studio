import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Trash2, Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SizeOption {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
  is_available: boolean;
}

export const SizeManagement = () => {
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSizeOption, setEditingSizeOption] = useState<SizeOption | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    width: '',
    height: '',
    price: '',
    is_available: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchSizeOptions();
  }, []);

  const fetchSizeOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('size_options')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSizeOptions(data || []);
    } catch (error) {
      console.error('Error fetching size options:', error);
      toast({
        title: "Error",
        description: "Failed to fetch size options",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sizeOption: SizeOption) => {
    setEditingSizeOption(sizeOption);
    setFormData({
      name: sizeOption.name,
      width: sizeOption.width.toString(),
      height: sizeOption.height.toString(),
      price: sizeOption.price.toString(),
      is_available: sizeOption.is_available,
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingSizeOption(null);
    setFormData({
      name: '',
      width: '',
      height: '',
      price: '',
      is_available: true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sizeData = {
        name: formData.name,
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        price: parseFloat(formData.price),
        is_available: formData.is_available,
      };

      if (editingSizeOption) {
        const { error } = await supabase
          .from('size_options')
          .update(sizeData)
          .eq('id', editingSizeOption.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Size option updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('size_options')
          .insert([sizeData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Size option created successfully",
        });
      }

      setShowForm(false);
      fetchSizeOptions();
    } catch (error) {
      console.error('Error saving size option:', error);
      toast({
        title: "Error",
        description: "Failed to save size option",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this size option?')) return;

    try {
      const { error } = await supabase
        .from('size_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Size option deleted successfully",
      });
      fetchSizeOptions();
    } catch (error) {
      console.error('Error deleting size option:', error);
      toast({
        title: "Error",
        description: "Failed to delete size option",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading size options...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Size Management</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Size Option
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSizeOption ? 'Edit Size Option' : 'Add New Size Option'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Size Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., A4, Letter, Custom"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder="21.0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="29.7"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price">Additional Price (₹)</Label>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                />
                <Label htmlFor="is_available">Available for customers</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSizeOption ? 'Update Size Option' : 'Create Size Option'}
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
        {sizeOptions.map((sizeOption) => (
          <Card key={sizeOption.id} className="relative">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{sizeOption.name}</CardTitle>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(sizeOption)}
                  className="h-8 w-8"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(sizeOption.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Dimensions: {sizeOption.width} × {sizeOption.height} cm
                </p>
                <p className="text-sm font-medium">
                  Additional Price: ₹{sizeOption.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${sizeOption.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {sizeOption.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sizeOptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Ruler className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No size options created yet</p>
        </div>
      )}
    </div>
  );
};
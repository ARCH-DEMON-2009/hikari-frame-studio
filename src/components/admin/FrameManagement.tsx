import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FrameStyle {
  id: string;
  name: string;
  price: number;
  preview_emoji: string;
  is_available: boolean;
}

export const FrameManagement = () => {
  const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFrame, setEditingFrame] = useState<FrameStyle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    preview_emoji: '🖼️',
    is_available: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFrameStyles();
  }, []);

  const fetchFrameStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('frame_styles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFrameStyles(data || []);
    } catch (error) {
      console.error('Error fetching frame styles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch frame styles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (frame: FrameStyle) => {
    setEditingFrame(frame);
    setFormData({
      name: frame.name,
      price: frame.price.toString(),
      preview_emoji: frame.preview_emoji,
      is_available: frame.is_available
    });
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingFrame(null);
    setFormData({
      name: '',
      price: '',
      preview_emoji: '🖼️',
      is_available: true
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const frameData = {
        name: formData.name,
        price: parseFloat(formData.price),
        preview_emoji: formData.preview_emoji,
        is_available: formData.is_available
      };

      if (editingFrame) {
        const { error } = await supabase
          .from('frame_styles')
          .update(frameData)
          .eq('id', editingFrame.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Frame style updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('frame_styles')
          .insert([frameData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Frame style created successfully",
        });
      }

      setShowForm(false);
      setEditingFrame(null);
      fetchFrameStyles();
    } catch (error) {
      console.error('Error saving frame style:', error);
      toast({
        title: "Error",
        description: "Failed to save frame style",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this frame style?')) return;

    try {
      const { error } = await supabase
        .from('frame_styles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Frame style deleted successfully",
      });
      
      fetchFrameStyles();
    } catch (error) {
      console.error('Error deleting frame style:', error);
      toast({
        title: "Error",
        description: "Failed to delete frame style",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading frame styles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Frame Styles Management</h2>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Frame Style
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingFrame ? 'Edit Frame Style' : 'Create New Frame Style'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Frame Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emoji">Preview Emoji</Label>
                  <Input
                    id="emoji"
                    value={formData.preview_emoji}
                    onChange={(e) => setFormData({ ...formData, preview_emoji: e.target.value })}
                    placeholder="🖼️"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                  <Label htmlFor="available">Available for customers</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingFrame ? 'Update' : 'Create'} Frame Style
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {frameStyles.map((frame) => (
          <Card key={frame.id}>
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{frame.preview_emoji}</div>
                <h3 className="text-lg font-semibold">{frame.name}</h3>
                <p className="text-2xl font-bold text-primary">₹{frame.price}</p>
                <p className="text-sm text-muted-foreground">
                  {frame.is_available ? 'Available' : 'Not Available'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(frame)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(frame.id)}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
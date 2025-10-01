import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RequestProductPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    productName: '',
    description: '',
    referenceLink: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send this to a backend
    console.log('Product request:', formData);
    
    toast({
      title: "Request Submitted",
      description: "We'll review your product request and get back to you soon!",
    });
    
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => navigate(-1)} variant="outline" className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Request a Product</h1>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Let us know what product you'd like to see!
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Product Request Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Naruto Figure, Custom Poster"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about the product you'd like..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="referenceLink">Reference Link (Optional)</Label>
                <Input
                  id="referenceLink"
                  type="url"
                  placeholder="https://example.com/product"
                  value={formData.referenceLink}
                  onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Share a link to a similar product if you have one
                </p>
              </div>

              <Button type="submit" className="w-full btn-primary">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestProductPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Upload, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FrameStyle {
  id: string;
  name: string;
  price: number;
  preview_emoji: string;
}

interface SizeOption {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
}

export const CustomizationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const product = location.state?.product;
  
  const [customizationType, setCustomizationType] = useState<string>('Frame');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [frameStyles, setFrameStyles] = useState<FrameStyle[]>([]);
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFrameStyles(), fetchSizeOptions()]).finally(() => setLoading(false));
  }, []);

  const fetchFrameStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('frame_styles')
        .select('*')
        .eq('is_available', true)
        .order('created_at');

      if (error) throw error;
      setFrameStyles(data || []);
    } catch (error) {
      console.error('Error fetching frame styles:', error);
    }
  };

  const fetchSizeOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('size_options')
        .select('*')
        .eq('is_available', true)
        .order('price');

      if (error) throw error;
      setSizeOptions(data || []);
      if (data && data.length > 0) {
        setSelectedSize(data[0].id); // Select first size by default
      }
    } catch (error) {
      console.error('Error fetching size options:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    document.getElementById('image-upload')?.click();
  };

  const handleAddToCart = () => {
    if (!selectedFrame || !selectedSize) {
      toast({
        title: "Missing Information",
        description: "Please select frame and size options.",
        variant: "destructive",
      });
      return;
    }

    const frameStyle = frameStyles.find(f => f.id === selectedFrame);
    const sizeOption = sizeOptions.find(s => s.id === selectedSize);
    
    if (!frameStyle || !sizeOption) return;

    const customItem = {
      productId: product?.id || 'custom',
      name: `Custom ${customizationType} - ${frameStyle.name} - ${sizeOption.name}`,
      price: frameStyle.price + sizeOption.price,
      quantity: 1,
      image: uploadedImage || product?.images?.[0] || '/placeholder.svg',
      category: `Custom ${customizationType}`,
      customization: {
        type: customizationType,
        uploadedImage: uploadedImage || null,
        frameStyle: frameStyle.name,
        size: sizeOption.name,
        scale: imageScale,
        rotation: imageRotation,
      },
    };

    addItem(customItem);
    navigate('/cart');
    
    toast({
      title: "Added to Cart",
      description: `Your custom ${customizationType.toLowerCase()} has been added to cart.`,
    });
  };

  const getFramePreview = (frameName: string) => {
    if (frameName.toLowerCase().includes('black')) return '/f1.jpg';
    if (frameName.toLowerCase().includes('white')) return '/f2.jpg';
    return '/f1.jpg'; // default
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading customization options...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button onClick={() => navigate(-1)} variant="outline" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-primary">Customize Your Product</h1>
        <p className="text-muted-foreground mt-2">Choose product type, upload your image, and select options</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Area */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview (A4 Size)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-cream-100 rounded-lg overflow-hidden" style={{ aspectRatio: '210/297' }}>
                {uploadedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    {/* Frame Preview */}
                    {selectedFrame && (
                      <div className="absolute inset-0 pointer-events-none">
                        <img 
                          src={getFramePreview(frameStyles.find(f => f.id === selectedFrame)?.name || '')}
                          alt="Frame preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {/* User Image */}
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-full max-h-full object-contain"
                      style={{
                        transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center p-8">
                      <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="font-medium mb-2">Optional: Upload Your Image</p>
                      <p className="text-sm">You can book your order without uploading an image now and provide it later</p>
                    </div>
                  </div>
                )}
              </div>
              
              {uploadedImage && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImageScale(Math.max(0.5, imageScale - 0.1))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImageScale(Math.min(2, imageScale + 0.1))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setImageRotation((imageRotation + 90) % 360)}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customization Options */}
        <div className="space-y-6">
          {/* Product Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Product Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={customizationType} onValueChange={setCustomizationType}>
                <div className="grid grid-cols-3 gap-3">
                  {['Frame', 'Poster', 'Figure'].map((type) => (
                    <div key={type} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="font-medium cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={triggerFileInput}
                variant="outline"
                className="w-full border-dashed border-2 py-8"
              >
                <Upload className="w-8 h-8 mr-2" />
                {uploadedImage ? 'Change Image' : 'Choose Image'}
              </Button>
              {uploadedImage && (
                <p className="text-sm text-green-600 mt-2 text-center">
                  ✓ Image uploaded successfully
                </p>
              )}
            </CardContent>
          </Card>

          {/* Frame Styles */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Frame Style</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedFrame} onValueChange={setSelectedFrame}>
                <div className="grid grid-cols-1 gap-3">
                  {frameStyles.map((frame) => (
                    <div key={frame.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={frame.id} id={frame.id} />
                      <img 
                        src={getFramePreview(frame.name)}
                        alt={frame.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <Label htmlFor={frame.id} className="font-medium cursor-pointer">
                          {frame.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">₹{frame.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Size Options */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Size</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="grid grid-cols-1 gap-3">
                  {sizeOptions.map((size) => (
                    <div key={size.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value={size.id} id={size.id} />
                      <div className="flex-1">
                        <Label htmlFor={size.id} className="font-medium cursor-pointer">
                          {size.name} ({size.width} × {size.height} cm)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {size.price > 0 ? `+₹${size.price}` : 'Included'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Frame:</span>
                  <span>₹{selectedFrame ? frameStyles.find(f => f.id === selectedFrame)?.price || 0 : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>₹{selectedSize ? sizeOptions.find(s => s.id === selectedSize)?.price || 0 : 0}</span>
                </div>
                <div className="border-t pt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>₹{(selectedFrame ? frameStyles.find(f => f.id === selectedFrame)?.price || 0 : 0) + (selectedSize ? sizeOptions.find(s => s.id === selectedSize)?.price || 0 : 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full btn-primary"
            disabled={!selectedFrame || !selectedSize}
          >
            Add to Cart
          </Button>
          {!uploadedImage && (
            <p className="text-sm text-center text-muted-foreground">
              You can upload your image later after placing the order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;
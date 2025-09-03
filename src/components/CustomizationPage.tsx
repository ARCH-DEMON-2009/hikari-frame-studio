
import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CustomizationPage = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState('');
  const [selectedSize, setSelectedSize] = useState('8x10 inches');
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [frameStyles, setFrameStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFrameStyles();
  }, []);

  const fetchFrameStyles = async () => {
    try {
      const { data, error } = await supabase
        .from('frame_styles')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedFrames = data?.map(frame => ({
        id: frame.id,
        name: frame.name,
        price: frame.price,
        preview: frame.preview_emoji
      })) || [];
      
      setFrameStyles(transformedFrames);
      if (transformedFrames.length > 0) {
        setSelectedFrame(transformedFrames[0].id);
      }
    } catch (error) {
      console.error('Error fetching frame styles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const selectedFrameData = frameStyles.find(frame => frame.id === selectedFrame);

  const handleAddToCart = () => {
    if (!uploadedImage) {
      toast({
        title: "Image required",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFrameData) {
      toast({
        title: "Frame required",
        description: "Please select a frame style",
        variant: "destructive",
      });
      return;
    }

    const customItem = {
      name: `Custom Frame - ${selectedFrameData.name}`,
      price: (selectedFrameData.price || 0) + 199 + 99,
      quantity: 1,
      image: uploadedImage,
      category: 'custom-frame',
      customization: {
        uploadedImage,
        frameStyle: selectedFrameData.name,
        size: selectedSize
      }
    };

    addItem(customItem);
    
    toast({
      title: "Added to cart",
      description: "Your custom frame has been added to the cart",
    });

    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-charcoal-700 mb-4">
              Customize Your Frame
            </h1>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              Upload your favorite photo and see how it looks in our premium frames. 
              Adjust the size, rotation, and choose the perfect frame style.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Area */}
            <div className="space-y-6">
              <Card className="card-elegant p-6">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">Preview</h3>
                
                <div className="aspect-square bg-gradient-to-br from-cream-200 to-blush-100 rounded-lg overflow-hidden relative border-8 border-current text-amber-700">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{
                        transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-lg font-medium">Upload an image to preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Controls */}
                {uploadedImage && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageScale(Math.max(0.5, imageScale - 0.1))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageScale(Math.min(2, imageScale + 0.1))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Upload Area */}
              <Card className="card-elegant p-6">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">Upload Image</h3>
                
                <div
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-cream-200 rounded-lg p-8 text-center cursor-pointer hover:border-blush-300 transition-colors"
                >
                  <Upload className="w-8 h-8 text-charcoal-400 mx-auto mb-4" />
                  <p className="text-charcoal-600 font-medium mb-2">Click to upload image</p>
                  <p className="text-sm text-charcoal-500">JPG, PNG up to 10MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </Card>
            </div>

            {/* Customization Options */}
            <div className="space-y-6">
              {/* Frame Selection */}
              <Card className="card-elegant p-6">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">Choose Frame Style</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {frameStyles.map((frame) => (
                    <div
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedFrame === frame.id
                          ? 'border-blush-300 bg-blush-100'
                          : 'border-cream-200 hover:border-cream-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{frame.preview}</div>
                      <h4 className="font-medium text-charcoal-700">{frame.name}</h4>
                      <p className="text-sm text-charcoal-600">₹{frame.price}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Size Options */}
              <Card className="card-elegant p-6">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">Size Options</h3>
                
                <div className="space-y-3">
                  {['8x10 inches', '11x14 inches', '16x20 inches', '20x24 inches'].map((size) => (
                    <label key={size} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-4 h-4 text-blush-300"
                      />
                      <span className="text-charcoal-600">{size}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Price Summary */}
              <Card className="card-elegant p-6">
                <h3 className="font-display font-semibold text-charcoal-700 mb-4">Price Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Frame ({selectedFrameData?.name})</span>
                    <span className="font-medium">₹{selectedFrameData?.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Printing & Processing</span>
                    <span className="font-medium">₹199</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-600">Shipping</span>
                    <span className="font-medium">₹99</span>
                  </div>
                  <div className="border-t border-cream-200 pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-charcoal-700">₹{(selectedFrameData?.price || 0) + 199 + 99}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="btn-primary w-full mt-6"
                  onClick={handleAddToCart}
                  disabled={!uploadedImage || !selectedFrameData}
                >
                  Add to Cart
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPage;

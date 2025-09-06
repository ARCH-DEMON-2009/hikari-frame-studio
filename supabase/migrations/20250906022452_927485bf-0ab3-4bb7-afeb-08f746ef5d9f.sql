-- Create size_options table for managing print sizes
CREATE TABLE public.size_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  width NUMERIC NOT NULL,
  height NUMERIC NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.size_options ENABLE ROW LEVEL SECURITY;

-- Create policies for size_options
CREATE POLICY "Everyone can view available size options" 
ON public.size_options 
FOR SELECT 
USING ((is_available = true) OR (auth.uid() IS NOT NULL));

CREATE POLICY "Admins can insert size options" 
ON public.size_options 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update size options" 
ON public.size_options 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete size options" 
ON public.size_options 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for timestamps
CREATE TRIGGER update_size_options_updated_at
BEFORE UPDATE ON public.size_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default size options
INSERT INTO public.size_options (name, width, height, price, is_available) VALUES
('A4', 21, 29.7, 0, true),
('A3', 29.7, 42, 50, true),
('8x10', 20.32, 25.4, 25, true),
('11x14', 27.94, 35.56, 75, true);

-- Add new settings for admin management
INSERT INTO public.settings (key, value, description) VALUES
('printing_processing_charge', '0', 'Charge for printing and processing (included in frame price)'),
('shipping_cost', '50', 'Standard shipping cost'),
('free_shipping_threshold', '500', 'Minimum order value for free shipping'),
('cod_charge', '25', 'Cash on delivery charge');

-- Add default frame styles with the downloaded images
INSERT INTO public.frame_styles (name, price, preview_emoji, is_available) VALUES
('Classic Black', 99, '🖤', true),
('Elegant White', 99, '🤍', true);
-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create frame_styles table for admin management
CREATE TABLE public.frame_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  preview_emoji TEXT NOT NULL DEFAULT '🖼️',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.frame_styles ENABLE ROW LEVEL SECURITY;

-- Create policies for frame_styles
CREATE POLICY "Everyone can view available frame styles" 
ON public.frame_styles 
FOR SELECT 
USING (is_available = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert frame styles" 
ON public.frame_styles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update frame styles" 
ON public.frame_styles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete frame styles" 
ON public.frame_styles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add timestamp trigger
CREATE TRIGGER update_frame_styles_updated_at
BEFORE UPDATE ON public.frame_styles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default frame styles
INSERT INTO public.frame_styles (name, price, preview_emoji) VALUES
('Classic Wood', 899, '🟫'),
('Modern Metal', 1299, '⬜'),
('Vintage Gold', 1599, '🟨'),
('Minimalist White', 999, '⬜');
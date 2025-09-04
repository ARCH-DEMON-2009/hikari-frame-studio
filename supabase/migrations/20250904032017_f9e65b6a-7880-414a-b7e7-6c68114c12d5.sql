-- Insert admin role for current user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('92176e93-a833-4d49-b01f-c5a3475c45e5', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create settings table for shipping and other admin settings
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.settings
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Everyone can read settings (for shipping costs etc.)
CREATE POLICY "Everyone can read settings" ON public.settings
FOR SELECT USING (true);

-- Insert default shipping settings
INSERT INTO public.settings (key, value, description) VALUES
('shipping_cost', '50', 'Default shipping cost in rupees'),
('free_shipping_threshold', '1000', 'Order amount above which shipping is free'),
('cod_charge', '30', 'Cash on delivery charges');

-- Create trigger for updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
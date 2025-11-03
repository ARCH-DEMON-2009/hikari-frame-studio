-- Allow ONLINE payment method in orders
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_payment_method_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_payment_method_check
CHECK (payment_method IN ('COD', 'ONLINE'));

-- Ensure status values support processing states we use
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check
CHECK (status IN ('PLACED','PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'));

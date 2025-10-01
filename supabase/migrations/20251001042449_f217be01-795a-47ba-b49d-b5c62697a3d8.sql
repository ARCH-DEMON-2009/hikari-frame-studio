-- Add external marketplace links to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS meesho_link text,
ADD COLUMN IF NOT EXISTS amazon_link text;
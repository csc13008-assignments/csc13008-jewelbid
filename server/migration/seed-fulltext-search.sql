-- Migration: Add fulltext search support to products table
-- Creates a search_vector column with GIN index for fast text search

-- Step 1: Add the tsvector column for fulltext search
ALTER TABLE products
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Step 2: Create GIN index for fast fulltext search
CREATE INDEX IF NOT EXISTS idx_products_search_vector
ON products USING GIN(search_vector);

-- Step 3: Create function to update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.brand, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.material, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger to automatically update search_vector on INSERT/UPDATE
DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION products_search_vector_update();

-- Step 5: Update existing products with search vectors
UPDATE products SET
    search_vector =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(brand, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(material, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'D');

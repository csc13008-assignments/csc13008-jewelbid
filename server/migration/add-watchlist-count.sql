-- Migration: Add watchlistCount column to products table
-- Created: 2024-12-18

-- Add watchlistCount column with default value 0
ALTER TABLE products
ADD COLUMN IF NOT EXISTS "watchlistCount" INT DEFAULT 0;

-- Populate existing data by counting watchlist entries
UPDATE products p
SET "watchlistCount" = (
    SELECT COUNT(*)
    FROM watchlist w
    WHERE w."productId" = p.id
);

-- Rollback (run this to undo the migration):
-- ALTER TABLE products DROP COLUMN IF EXISTS "watchlistCount";

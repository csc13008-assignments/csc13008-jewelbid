-- Migration: Add watchlistCount column to products table

-- Populate existing data by counting watchlist entries
UPDATE products p
SET "watchlistCount" = (
    SELECT COUNT(*)
    FROM watchlist w
    WHERE w."productId" = p.id
);

-- Rollback (run this to undo the migration):
-- ALTER TABLE products DROP COLUMN IF EXISTS "watchlistCount";

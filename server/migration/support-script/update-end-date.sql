-- Migration: Update endDate for active products to extend auction time
-- This script updates products with status 'Active' to have endDate at least 7 days from now

-- Set random end dates between 7-14 days for variety
UPDATE products
SET
     "endDate" = NOW() + INTERVAL '7 days' + (RANDOM() * INTERVAL '7 days'),
     updated_at = NOW()
 WHERE
     status = 'Active';

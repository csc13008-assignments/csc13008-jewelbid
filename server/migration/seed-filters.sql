-- Seed data for filter_options table
-- Run this script to populate the filter_options table with filter categories

-- Create filter_options table if not exists (TypeORM should handle this, but just in case)
-- The table will be created by TypeORM synchronize in development

-- Clear existing filter options (optional - comment out if you want to preserve existing data)
-- DELETE FROM filter_options;

-- Insert Brand options
INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('f0000001-0001-0000-0000-000000000001', 'Cartier', 'cartier', 'brand', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0002-0000-0000-000000000002', 'Tiffany & Co', 'tiffany', 'brand', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0003-0000-0000-000000000003', 'Pandora', 'pandora', 'brand', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0004-0000-0000-000000000004', 'Gucci', 'gucci', 'brand', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0005-0000-0000-000000000005', 'Dior', 'dior', 'brand', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0006-0000-0000-000000000006', 'Local Artisan Brands', 'local', 'brand', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0007-0000-0000-000000000007', 'Van Cleef & Arpels', 'van-cleef-arpels', 'brand', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0008-0000-0000-000000000008', 'Bvlgari', 'bvlgari', 'brand', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0009-0000-0000-000000000009', 'Harry Winston', 'harry-winston', 'brand', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0010-0000-0000-000000000010', 'Graff', 'graff', 'brand', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0011-0000-0000-000000000011', 'Chopard', 'chopard', 'brand', 11, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0012-0000-0000-000000000012', 'Mikimoto', 'mikimoto', 'brand', 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0013-0000-0000-000000000013', 'Rolex', 'rolex', 'brand', 13, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0014-0000-0000-000000000014', 'Patek Philippe', 'patek-philippe', 'brand', 14, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0015-0000-0000-000000000015', 'Piaget', 'piaget', 'brand', 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0016-0000-0000-000000000016', 'Buccellati', 'buccellati', 'brand', 16, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0017-0000-0000-000000000017', 'David Webb', 'david-webb', 'brand', 17, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000001-0018-0000-0000-000000000018', 'PAMP Suisse', 'pamp-suisse', 'brand', 18, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

-- Insert Material options
INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('f0000002-0001-0000-0000-000000000001', 'Gold', 'gold', 'material', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0002-0000-0000-000000000002', 'Silver', 'silver', 'material', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0003-0000-0000-000000000003', 'Platinum', 'platinum', 'material', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0004-0000-0000-000000000004', 'Diamond', 'diamond', 'material', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0005-0000-0000-000000000005', 'Gemstone', 'gemstone', 'material', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0006-0000-0000-000000000006', 'Leather', 'leather', 'material', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0007-0000-0000-000000000007', 'Pearl', 'pearl', 'material', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0008-0000-0000-000000000008', 'Rose Gold', 'rose-gold', 'material', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0009-0000-0000-000000000009', 'White Gold', 'white-gold', 'material', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0010-0000-0000-000000000010', 'Jade', 'jade', 'material', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0011-0000-0000-000000000011', 'Ruby', 'ruby', 'material', 11, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0012-0000-0000-000000000012', 'Sapphire', 'sapphire', 'material', 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000002-0013-0000-0000-000000000013', 'Emerald', 'emerald', 'material', 13, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

-- Insert Target Audience options
INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('f0000003-0001-0000-0000-000000000001', 'For Men', 'for-men', 'target_audience', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000003-0002-0000-0000-000000000002', 'For Women', 'for-women', 'target_audience', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000003-0003-0000-0000-000000000003', 'For Couples', 'for-couples', 'target_audience', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000003-0004-0000-0000-000000000004', 'For Kids', 'for-kids', 'target_audience', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000003-0005-0000-0000-000000000005', 'Unisex', 'unisex', 'target_audience', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

-- Insert Auction Status options
INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('f0000004-0001-0000-0000-000000000001', 'Ending Soon', 'ending-soon', 'auction_status', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000004-0002-0000-0000-000000000002', 'Most Bids', 'most-bids', 'auction_status', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000004-0003-0000-0000-000000000003', 'Highest Price', 'highest-price', 'auction_status', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f0000004-0004-0000-0000-000000000004', 'Newly Listed', 'newly-listed', 'auction_status', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

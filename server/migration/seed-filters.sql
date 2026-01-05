INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('a1b2c3d4-1111-4aaa-8888-111111111111', 'Cartier', 'cartier', 'brand', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111112', 'Tiffany & Co', 'tiffany', 'brand', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111113', 'Pandora', 'pandora', 'brand', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111114', 'Gucci', 'gucci', 'brand', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111115', 'Dior', 'dior', 'brand', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111116', 'Local Artisan Brands', 'local', 'brand', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111117', 'Van Cleef & Arpels', 'van-cleef-arpels', 'brand', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111118', 'Bvlgari', 'bvlgari', 'brand', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111119', 'Harry Winston', 'harry-winston', 'brand', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111a', 'Graff', 'graff', 'brand', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111b', 'Chopard', 'chopard', 'brand', 11, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111c', 'Mikimoto', 'mikimoto', 'brand', 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111d', 'Rolex', 'rolex', 'brand', 13, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111e', 'Patek Philippe', 'patek-philippe', 'brand', 14, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-11111111111f', 'Piaget', 'piaget', 'brand', 15, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111120', 'Buccellati', 'buccellati', 'brand', 16, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111121', 'David Webb', 'david-webb', 'brand', 17, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a1b2c3d4-1111-4aaa-8888-111111111122', 'PAMP Suisse', 'pamp-suisse', 'brand', 18, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('b2c3d4e5-2222-4bbb-9999-222222222221', 'Gold', 'gold', 'material', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222222', 'Silver', 'silver', 'material', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222223', 'Platinum', 'platinum', 'material', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222224', 'Diamond', 'diamond', 'material', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222225', 'Gemstone', 'gemstone', 'material', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222226', 'Leather', 'leather', 'material', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222227', 'Pearl', 'pearl', 'material', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222228', 'Rose Gold', 'rose-gold', 'material', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-222222222229', 'White Gold', 'white-gold', 'material', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-22222222222a', 'Jade', 'jade', 'material', 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-22222222222b', 'Ruby', 'ruby', 'material', 11, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-22222222222c', 'Sapphire', 'sapphire', 'material', 12, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b2c3d4e5-2222-4bbb-9999-22222222222d', 'Emerald', 'emerald', 'material', 13, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('c3d4e5f6-3333-4ccc-aaaa-333333333331', 'For Men', 'for-men', 'target_audience', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-3333-4ccc-aaaa-333333333332', 'For Women', 'for-women', 'target_audience', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-3333-4ccc-aaaa-333333333333', 'For Couples', 'for-couples', 'target_audience', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-3333-4ccc-aaaa-333333333334', 'For Kids', 'for-kids', 'target_audience', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c3d4e5f6-3333-4ccc-aaaa-333333333335', 'Unisex', 'unisex', 'target_audience', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('d4e5f6a7-4444-4ddd-bbbb-444444444441', 'Ending Soon', 'ending-soon', 'auction_status', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-4444-4ddd-bbbb-444444444442', 'Most Bids', 'most-bids', 'auction_status', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-4444-4ddd-bbbb-444444444443', 'Highest Price', 'highest-price', 'auction_status', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('d4e5f6a7-4444-4ddd-bbbb-444444444444', 'Newly Listed', 'newly-listed', 'auction_status', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('e5f6a7b8-5555-4eee-cccc-555555555551', 'Vintage (1920-1980)', 'vintage', 'era', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555552', 'Antique (before 1920)', 'antique', 'era', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555553', 'Modern (1980-present)', 'modern', 'era', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555554', 'Contemporary (2000-present)', 'contemporary', 'era', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555555', 'Art Deco (1920-1940)', 'art-deco', 'era', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555556', 'Victorian (1837-1901)', 'victorian', 'era', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('e5f6a7b8-5555-4eee-cccc-555555555557', 'Edwardian (1901-1915)', 'edwardian', 'era', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('f6a7b8c9-6666-4fff-dddd-666666666661', '24K Gold', '24k', 'fineness', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666662', '22K Gold', '22k', 'fineness', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666663', '18K Gold', '18k', 'fineness', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666664', '14K Gold', '14k', 'fineness', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666665', '10K Gold', '10k', 'fineness', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666666', '925 Sterling Silver', '925', 'fineness', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666667', '950 Platinum', '950', 'fineness', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666668', '999 Fine Silver', '999', 'fineness', 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('f6a7b8c9-6666-4fff-dddd-666666666669', 'Other', 'other-fineness', 'fineness', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

INSERT INTO filter_options (id, name, slug, "filterType", "order", "isActive", created_at, updated_at) VALUES
('a7b8c9d0-7777-4aaa-eeee-777777777771', 'New', 'new', 'condition', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777772', 'Like New', 'like-new', 'condition', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777773', 'Excellent', 'excellent', 'condition', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777774', 'Very Good', 'very-good', 'condition', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777775', 'Good', 'good', 'condition', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777776', 'Fair', 'fair', 'condition', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('a7b8c9d0-7777-4aaa-eeee-777777777777', 'Poor', 'poor', 'condition', 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

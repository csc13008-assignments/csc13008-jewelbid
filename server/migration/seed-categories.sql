INSERT INTO categories (id, name, description, slug, "parentId", "order", "isActive", created_at, updated_at) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Ring', 'Beautiful rings including engagement rings, wedding bands, and fashion rings', 'ring', NULL, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440001', 'Necklace', 'Elegant necklaces and chains for all occasions', 'necklace', NULL, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-41d2-80c7-93c3d6a3c8d1', 'Bracelet', 'Stunning bracelets including bangles, cuffs, and charm bracelets', 'bracelet', NULL, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b811-9dad-41d2-80c7-93c3d6a3c8d2', 'Earring', 'Stunning earrings including studs, hoops, and drop earrings', 'earring', NULL, 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b812-9dad-41d2-80c7-93c3d6a3c8d3', 'Brooch', 'Elegant brooches and pins for sophisticated styling', 'brooch', NULL, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b813-9dad-41d2-80c7-93c3d6a3c8d4', 'Pendant', 'Beautiful pendants to complement any chain or necklace', 'pendant', NULL, 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b814-9dad-41d2-80c7-93c3d6a3c8d5', 'Watch', 'Luxury and casual watches from top brands', 'watch', NULL, 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b815-9dad-41d2-80c7-93c3d6a3c8d6', 'Gemstone', 'Precious and semi-precious gemstones for collectors and jewelers', 'gemstone', NULL, 8, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b816-9dad-41d2-80c7-93c3d6a3c8d7', 'Gold Bar', 'Investment-grade gold bars and bullion', 'gold-bar', NULL, 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b817-9dad-41d2-80c7-93c3d6a3c8d8', 'Diamond', 'Loose diamonds and diamond jewelry pieces', 'diamond', NULL, 10, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

-- Seed data for categories table
-- Run this script to populate the categories table with jewelry categories

-- First, clear existing categories (optional - comment out if you want to preserve existing data)
-- DELETE FROM categories;

-- Insert jewelry categories
INSERT INTO categories (id, name, description, slug, "parentId", "order", "isActive", created_at, updated_at) VALUES
('c0000001-0000-0000-0000-000000000001', 'Ring', 'Beautiful rings including engagement rings, wedding bands, and fashion rings', 'ring', NULL, 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000002', 'Necklace', 'Elegant necklaces and chains for all occasions', 'necklace', NULL, 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000003', 'Watch', 'Luxury and casual watches from top brands', 'watch', NULL, 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000004', 'Earring', 'Stunning earrings including studs, hoops, and drop earrings', 'earring', NULL, 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000005', 'Anklet', 'Delicate anklets and ankle bracelets', 'anklet', NULL, 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000006', 'Pendant', 'Beautiful pendants to complement any chain or necklace', 'pendant', NULL, 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('c0000001-0000-0000-0000-000000000007', 'Charm', 'Charming charms for bracelets and necklaces', 'charm', NULL, 7, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    "order" = EXCLUDED."order",
    "isActive" = EXCLUDED."isActive",
    updated_at = CURRENT_TIMESTAMP;

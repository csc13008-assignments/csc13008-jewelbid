-- Migration: Update products with correct attribute IDs
-- This script updates brandId, materialId, targetAudienceId, eraId, finenessId, conditionId for existing products

-- Product 1: Cartier Love Bracelet 18K White Gold with Diamonds
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111111',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222229',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'a1a1a1a1-1111-4111-8111-a1a1a1a1a1a1';

-- Product 2: Tiffany & Co. Solitaire Diamond Engagement Ring 2.5ct
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111112',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222223',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666667',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777772',
    updated_at = NOW()
WHERE id = 'b2b2b2b2-2222-4222-8222-b2b2b2b2b2b2';

-- Product 3: Van Cleef & Arpels Alhambra Necklace 18K Yellow Gold
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111117',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222221',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555553',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'c3c3c3c3-3333-4333-8333-c3c3c3c3c3c3';

-- Product 4: Natural Burmese Ruby 5.12ct Unheated Pigeon Blood
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222225',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555552',
    "finenessId" = NULL,
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'd4d4d4d4-4444-4444-8444-d4d4d4d4d4d4';

-- Product 5: Rolex Lady-Datejust 28mm Steel and Yellow Gold
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111d',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222221',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'e5e5e5e5-5555-4555-8555-e5e5e5e5e5e5';

-- Product 6: Bvlgari Serpenti Diamond Bracelet Watch 18K Rose Gold
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111118',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222228',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'f6f6f6f6-6666-4666-8666-f6f6f6f6f6f6';

-- Product 7: Harry Winston Emerald Cut Diamond Earrings 4ct Total
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111119',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222223',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666667',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777772',
    updated_at = NOW()
WHERE id = 'a7a7a7a7-7777-4777-8777-a7a7a7a7a7a7';

-- Product 8: Graff Pink Diamond Ring 1.8ct Fancy Intense Pink
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111a',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222223',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666667',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'b8b8b8b8-8888-4888-8888-b8b8b8b8b8b8';

-- Product 9: Chopard Happy Diamonds Pendant 18K White Gold
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111b',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222229',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555553',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777772',
    updated_at = NOW()
WHERE id = 'c9c9c9c9-9999-4999-8999-c9c9c9c9c9c9';

-- Product 10: Natural Jadeite Jade Bangle Imperial Green
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-22222222222a',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555551',
    "finenessId" = NULL,
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'd0d0d0d0-aaaa-4aaa-8aaa-d0d0d0d0d0d0';

-- Product 11: Mikimoto Akoya Pearl Necklace 8-8.5mm AAA Quality
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111c',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222227',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555553',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'e1e1e1e1-bbbb-4bbb-8bbb-e1e1e1e1e1e1';

-- Product 12: Certified Natural Colombian Emerald 3.85ct
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222225',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555553',
    "finenessId" = NULL,
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'f2f2f2f2-cccc-4ccc-8ccc-f2f2f2f2f2f2';

-- Product 13: Patek Philippe Calatrava Rose Gold Diamond Bezel
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111e',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222228',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777774',
    updated_at = NOW()
WHERE id = 'a3a3a3a3-dddd-4ddd-8ddd-a3a3a3a3a3a3';

-- Product 14: Buccellati Vintage Gold Leaf Brooch 18K Yellow Gold
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111120',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222221',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555551',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777774',
    updated_at = NOW()
WHERE id = 'b4b4b4b4-eeee-4eee-8eee-b4b4b4b4b4b4';

-- Product 15: Natural Kashmir Sapphire 4.67ct Unheated Cornflower Blue
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222225',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555552',
    "finenessId" = NULL,
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'c5c5c5c5-ffff-4fff-8fff-c5c5c5c5c5c5';

-- Product 16: 24K Pure Gold Bar 100g PAMP Suisse with Assay
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111122',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222221',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666661',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'd6d6d6d6-0101-4101-8101-d6d6d6d6d6d6';

-- Product 17: Flawless D Color Diamond 3.01ct Round Brilliant GIA
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222224',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333335',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = NULL,
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'e7e7e7e7-0202-4202-8202-e7e7e7e7e7e7';

-- Product 18: Art Deco Diamond and Sapphire Bracelet Platinum
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111116',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222223',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555555',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666667',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777774',
    updated_at = NOW()
WHERE id = 'f8f8f8f8-0303-4303-8303-f8f8f8f8f8f8';

-- Product 19: Piaget Polo Date Rose Gold Diamond Bezel Automatic
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-11111111111f',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222228',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333331',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555554',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777771',
    updated_at = NOW()
WHERE id = 'a9a9a9a9-0404-4404-8404-a9a9a9a9a9a9';

-- Product 20: David Webb Enamel and Diamond Cuff Bracelet
UPDATE products SET
    "brandId" = 'a1b2c3d4-1111-4aaa-8888-111111111121',
    "materialId" = 'b2c3d4e5-2222-4bbb-9999-222222222221',
    "targetAudienceId" = 'c3d4e5f6-3333-4ccc-aaaa-333333333332',
    "eraId" = 'e5f6a7b8-5555-4eee-cccc-555555555551',
    "finenessId" = 'f6a7b8c9-6666-4fff-dddd-666666666663',
    "conditionId" = 'a7b8c9d0-7777-4aaa-eeee-777777777773',
    updated_at = NOW()
WHERE id = 'b0b0b0b0-0505-4505-8505-b0b0b0b0b0b0';

-- Update existing products with brand, material, and targetAudience values
-- Run this after the seed-data.sql to populate the new columns

-- Product 1: Cartier Love Bracelet 18K White Gold with Diamonds
UPDATE products SET brand = 'Cartier', material = 'White Gold', "targetAudience" = 'unisex' WHERE id = '01940000-0001-7000-8000-000000000001';

-- Product 2: Tiffany & Co. Solitaire Diamond Engagement Ring 2.5ct
UPDATE products SET brand = 'Tiffany & Co', material = 'Platinum', "targetAudience" = 'for-women' WHERE id = '01940000-0002-7000-8000-000000000002';

-- Product 3: Van Cleef & Arpels Alhambra Necklace 18K Yellow Gold
UPDATE products SET brand = 'Van Cleef & Arpels', material = 'Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0003-7000-8000-000000000003';

-- Product 4: Natural Burmese Ruby 5.12ct Unheated Pigeon Blood
UPDATE products SET brand = NULL, material = 'Ruby', "targetAudience" = 'unisex' WHERE id = '01940000-0004-7000-8000-000000000004';

-- Product 5: Rolex Lady-Datejust 28mm Steel and Yellow Gold Diamond Dial
UPDATE products SET brand = 'Rolex', material = 'Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0005-7000-8000-000000000005';

-- Product 6: Bvlgari Serpenti Diamond Bracelet Watch 18K Rose Gold
UPDATE products SET brand = 'Bvlgari', material = 'Rose Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0006-7000-8000-000000000006';

-- Product 7: Harry Winston Emerald Cut Diamond Earrings 4ct Total
UPDATE products SET brand = 'Harry Winston', material = 'Platinum', "targetAudience" = 'for-women' WHERE id = '01940000-0007-7000-8000-000000000007';

-- Product 8: Graff Pink Diamond Ring 1.8ct Fancy Intense Pink
UPDATE products SET brand = 'Graff', material = 'Platinum', "targetAudience" = 'for-women' WHERE id = '01940000-0008-7000-8000-000000000008';

-- Product 9: Chopard Happy Diamonds Pendant 18K White Gold
UPDATE products SET brand = 'Chopard', material = 'White Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0009-7000-8000-000000000009';

-- Product 10: Natural Jadeite Jade Bangle Imperial Green
UPDATE products SET brand = NULL, material = 'Jade', "targetAudience" = 'for-women' WHERE id = '01940000-0010-7000-8000-000000000010';

-- Product 11: Mikimoto Akoya Pearl Necklace 8-8.5mm AAA Quality
UPDATE products SET brand = 'Mikimoto', material = 'Pearl', "targetAudience" = 'for-women' WHERE id = '01940000-0011-7000-8000-000000000011';

-- Product 12: Certified Natural Colombian Emerald 3.85ct
UPDATE products SET brand = NULL, material = 'Emerald', "targetAudience" = 'unisex' WHERE id = '01940000-0012-7000-8000-000000000012';

-- Product 13: Patek Philippe Calatrava Rose Gold Diamond Bezel
UPDATE products SET brand = 'Patek Philippe', material = 'Rose Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0013-7000-8000-000000000013';

-- Product 14: Buccellati Vintage Gold Leaf Brooch 18K Yellow Gold
UPDATE products SET brand = 'Buccellati', material = 'Gold', "targetAudience" = 'for-women' WHERE id = '01940000-0014-7000-8000-000000000014';

-- Product 15: Natural Kashmir Sapphire 4.67ct Unheated Cornflower Blue
UPDATE products SET brand = NULL, material = 'Sapphire', "targetAudience" = 'unisex' WHERE id = '01940000-0015-7000-8000-000000000015';

-- Product 16: 24K Pure Gold Bar 100g PAMP Suisse with Assay
UPDATE products SET brand = 'PAMP Suisse', material = 'Gold', "targetAudience" = 'unisex' WHERE id = '01940000-0016-7000-8000-000000000016';

-- Product 17: Flawless D Color Diamond 3.01ct Round Brilliant GIA
UPDATE products SET brand = NULL, material = 'Diamond', "targetAudience" = 'unisex' WHERE id = '01940000-0017-7000-8000-000000000017';

-- Product 18: Art Deco Diamond and Sapphire Bracelet Platinum
UPDATE products SET brand = NULL, material = 'Platinum', "targetAudience" = 'for-women' WHERE id = '01940000-0018-7000-8000-000000000018';

-- Product 19: Piaget Polo Date Rose Gold Diamond Bezel Automatic
UPDATE products SET brand = 'Piaget', material = 'Rose Gold', "targetAudience" = 'for-men' WHERE id = '01940000-0019-7000-8000-000000000019';

-- Product 20: David Webb Enamel and Diamond Cuff Bracelet
UPDATE products SET brand = 'David Webb', material = 'Gold', "targetAudience" = 'unisex' WHERE id = '01940000-0020-7000-8000-000000000020';

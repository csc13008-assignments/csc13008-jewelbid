-- Migration script to add maxBid column to existing bids table
-- For backward compatibility with existing manual bidding data

-- Add maxBid column (nullable for backward compatibility)
ALTER TABLE bids ADD COLUMN IF NOT EXISTS "maxBid" DECIMAL(15,2);

-- Migrate existing data: set maxBid = bidAmount for all existing bids
UPDATE bids SET "maxBid" = "bidAmount" WHERE "maxBid" IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN bids."maxBid" IS 'Maximum bid amount for auto-bidding. Null for legacy manual bids, will be set to bidAmount during migration.';

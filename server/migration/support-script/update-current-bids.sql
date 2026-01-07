-- Migration: Update products currentPrice, currentBidderId, and bidCount based on bids
-- This script calculates the highest bid and bidder for each product from the bids table

UPDATE products p
SET
    "currentPrice" = b.max_bid,
    "currentBidderId" = b.highest_bidder,
    "bidCount" = b.total_bids,
    updated_at = NOW()
FROM (
    SELECT
        "productId",
        MAX("bidAmount") as max_bid,
        COUNT(*) as total_bids,
        (
            SELECT "bidderId"
            FROM bids b2
            WHERE b2."productId" = b1."productId"
            AND b2."bidAmount" = MAX(b1."bidAmount")
            AND b2."isRejected" = false
            LIMIT 1
        ) as highest_bidder
    FROM bids b1
    WHERE "isRejected" = false
    GROUP BY "productId"
) b
WHERE p.id = b."productId";
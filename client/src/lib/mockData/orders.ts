import { Order, OrderStatus } from '@/types/order';

// Mock order data for testing UI
export const createMockOrder = (productId: string, userId: string): Order => {
    return {
        id: 'mock-order-001',
        productId: productId,
        sellerId: 'seller-123',
        buyerId: userId,
        finalPrice: 0,
        status: OrderStatus.PENDING_SHIPMENT,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

export const createMockOrderWithPayment = (
    productId: string,
    userId: string,
): Order => {
    return {
        id: 'mock-order-002',
        productId: productId,
        sellerId: 'seller-123',
        buyerId: userId,
        finalPrice: 0,
        status: OrderStatus.PENDING_SHIPMENT,
        paymentProof:
            'https://images.unsplash.com/photo-1554224311-beee4f71f937?w=500',
        deliveryAddress: '123 Main St\nHanoi, Vietnam\n100000',
        created_at: new Date(),
        updated_at: new Date(),
    };
};

export const createMockCompletedOrder = (
    productId: string,
    userId: string,
): Order => {
    return {
        id: 'mock-order-003',
        productId: productId,
        sellerId: 'seller-123',
        buyerId: userId,
        finalPrice: 0,
        status: OrderStatus.COMPLETED,
        paymentProof:
            'https://images.unsplash.com/photo-1554224311-beee4f71f937?w=500',
        deliveryAddress: '123 Main St\nHanoi, Vietnam\n100000',
        trackingNumber: 'TRACK-123456789',
        sellerRating: 1,
        buyerRating: 1,
        sellerComment: 'Great buyer, fast payment!',
        buyerComment: 'Excellent seller, item as described!',
        created_at: new Date(),
        updated_at: new Date(),
    };
};

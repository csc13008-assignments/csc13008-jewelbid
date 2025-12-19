import { Order, OrderStatus } from '@/types/order';

// Mock order data for testing UI
export const createMockOrder = (productId: string, userId: string): Order => {
    return {
        id: 'mock-order-001',
        productId: productId,
        sellerId: 'seller-123',
        buyerId: userId,
        status: OrderStatus.SHIPPING_PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        status: OrderStatus.SHIPPING_PENDING,
        paymentProof:
            'https://images.unsplash.com/photo-1554224311-beee4f71f937?w=500',
        shippingAddress: '123 Main St\nHanoi, Vietnam\n100000',
        createdAt: new Date(),
        updatedAt: new Date(),
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
        status: OrderStatus.COMPLETED,
        paymentProof:
            'https://images.unsplash.com/photo-1554224311-beee4f71f937?w=500',
        shippingAddress: '123 Main St\nHanoi, Vietnam\n100000',
        shippingInvoice: 'TRACK-123456789',
        sellerRating: 1,
        buyerRating: 1,
        sellerComment: 'Great buyer, fast payment!',
        buyerComment: 'Excellent seller, item as described!',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

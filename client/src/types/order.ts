export enum OrderStatus {
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    SHIPPING_PENDING = 'SHIPPING_PENDING',
    DELIVERY_PENDING = 'DELIVERY_PENDING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface Order {
    id: string;
    productId: string;
    sellerId: string;
    buyerId: string;
    status: OrderStatus;
    paymentProof?: string;
    shippingAddress?: string;
    shippingInvoice?: string;
    sellerRating?: number; // +1 or -1
    buyerRating?: number;
    sellerComment?: string;
    buyerComment?: string;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatMessage {
    id: string;
    orderId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

export enum OrderStatus {
    PENDING_PAYMENT_INFO = 'Pending Payment Info',
    PENDING_SHIPMENT = 'Pending Shipment',
    PENDING_DELIVERY_CONFIRMATION = 'Pending Delivery Confirmation',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export interface Order {
    id: string;
    productId: string;
    sellerId: string;
    buyerId: string;
    finalPrice: number;
    status: OrderStatus;
    paymentProof?: string;
    deliveryAddress?: string;
    trackingNumber?: string;
    sellerNotes?: string;
    buyerNotes?: string;
    cancellationReason?: string;
    paymentInfoSubmittedAt?: Date;
    shipmentConfirmedAt?: Date;
    deliveryConfirmedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    created_at: Date;
    updated_at: Date;
    // Frontend-only fields for rating display (from separate Rating entity)
    sellerRating?: number;
    buyerRating?: number;
    sellerComment?: string;
    buyerComment?: string;
}

export interface ChatMessage {
    id: string;
    orderId: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: Date;
}

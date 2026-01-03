import { apiClient } from './client';
import { Order, ChatMessage } from '@/types/order';

// Rating type matching backend
export type RatingType = 'Positive' | 'Negative';

export const ordersApi = {
    // Get order for a product
    async getOrderByProduct(productId: string): Promise<Order | null> {
        try {
            const response = await apiClient.get<Order>(
                `/orders/product/${productId}`,
            );
            return response.data;
        } catch {
            return null;
        }
    },

    // Create Order (from won auction) - Note: Backend auto-creates on auction end
    async createOrder(productId: string): Promise<Order> {
        const response = await apiClient.post<Order>('/orders', {
            productId,
        });
        return response.data;
    },

    // Step 1: Submit Payment Info
    async submitPaymentInfo(
        productId: string,
        data: {
            paymentProof: string;
            deliveryAddress: string;
            buyerNotes?: string;
        },
    ) {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/submit-payment`,
            data,
        );
        return response.data;
    },

    // Step 2: Confirm Shipment
    async confirmShipment(
        productId: string,
        data: { trackingNumber: string; sellerNotes?: string },
    ) {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/confirm-shipment`,
            data,
        );
        return response.data;
    },

    // Step 3: Confirm Delivery
    async confirmDelivery(productId: string, buyerNotes?: string) {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/confirm-delivery`,
            { buyerNotes },
        );
        return response.data;
    },

    // Cancel Order
    async cancelOrder(productId: string, reason: string): Promise<Order> {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/cancel`,
            {
                reason,
            },
        );
        return response.data;
    },

    // Rating APIs - integrated with users controller
    async submitRating(
        toUserId: string,
        productId: string,
        ratingType: RatingType,
        comment?: string,
    ) {
        const response = await apiClient.post('/users/ratings', {
            toUserId,
            productId,
            ratingType,
            comment,
        });
        return response.data;
    },

    async updateRating(
        ratingId: string,
        ratingType?: RatingType,
        comment?: string,
    ) {
        const response = await apiClient.patch(`/users/ratings/${ratingId}`, {
            ratingType,
            comment,
        });
        return response.data;
    },

    async getMyRatings() {
        const response = await apiClient.get('/users/my-ratings');
        return response.data;
    },

    // Get my rating for a specific product
    async getMyRatingForProduct(productId: string): Promise<{
        id: string;
        ratingType: RatingType;
        comment?: string;
    } | null> {
        try {
            const response = await apiClient.get(
                `/users/ratings/product/${productId}`,
            );
            return response.data;
        } catch {
            return null;
        }
    },

    // Get chat messages for an order (uses /chat endpoint)
    async getChatMessages(orderId: string): Promise<ChatMessage[]> {
        try {
            const response = await apiClient.get<
                {
                    id: string;
                    orderId: string;
                    senderId: string;
                    sender?: { fullname: string };
                    content: string;
                    created_at: string;
                }[]
            >(`/chat/${orderId}`);
            // Map backend response to frontend ChatMessage type
            return response.data.map((msg) => ({
                id: msg.id,
                orderId: msg.orderId,
                senderId: msg.senderId,
                senderName: msg.sender?.fullname || 'Unknown',
                message: msg.content,
                timestamp: new Date(msg.created_at),
            }));
        } catch {
            return [];
        }
    },

    // Send a chat message (uses /chat endpoint)
    async sendChatMessage(
        orderId: string,
        content: string,
    ): Promise<ChatMessage> {
        const response = await apiClient.post<{
            id: string;
            orderId: string;
            senderId: string;
            content: string;
            created_at: string;
        }>('/chat/send', {
            orderId,
            content,
        });
        return {
            id: response.data.id,
            orderId: response.data.orderId,
            senderId: response.data.senderId,
            senderName: 'You',
            message: response.data.content,
            timestamp: new Date(response.data.created_at),
        };
    },

    // Mark messages as read
    async markMessagesAsRead(orderId: string): Promise<void> {
        await apiClient.patch(`/chat/${orderId}/mark-read`);
    },

    // Upload payment proof image to ImageKit and return URL
    async uploadPaymentProof(base64Data: string): Promise<string> {
        const response = await apiClient.post<{ url: string }>(
            '/upload/base64',
            {
                base64Data,
                fileName: `payment-proof-${Date.now()}.jpg`,
                folder: 'orders/payment-proofs',
            },
        );
        return response.data.url;
    },
};

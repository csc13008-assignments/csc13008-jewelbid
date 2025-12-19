import { apiClient } from './client';
import { Order, ChatMessage } from '@/types/order';

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

    // Step 1: Submit Payment Info
    async submitPaymentInfo(
        productId: string,
        data: { paymentProof: string; shippingAddress: string },
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
        data: { shippingInvoice: string },
    ) {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/confirm-shipment`,
            {
                trackingNumber: data.shippingInvoice, // Backend expects trackingNumber
            },
        );
        return response.data;
    },

    // Step 3: Confirm Delivery
    async confirmDelivery(productId: string) {
        const response = await apiClient.post<Order>(
            `/orders/${productId}/confirm-delivery`,
            {},
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

    // Rating (Mock - Backend not ready)
    async submitRating(
        productId: string,
        data: { rating: number; comment: string; isSeller: boolean },
    ) {
        // TODO: Implement backend endpoint for rating
        console.log('Submitting rating:', data);
        // Returning success
        return { success: true };
    },

    // Get chat messages for an order
    async getChatMessages(orderId: string): Promise<ChatMessage[]> {
        try {
            // Note: Backend might need this endpoint. If not, this will 404.
            const response = await apiClient.get<ChatMessage[]>(
                `/orders/${orderId}/messages`,
            );
            return response.data;
        } catch {
            return [];
        }
    },

    // Send a chat message
    async sendChatMessage(
        orderId: string,
        message: string,
    ): Promise<ChatMessage> {
        const response = await apiClient.post<ChatMessage>(
            `/orders/${orderId}/messages`,
            {
                message,
            },
        );
        return response.data;
    },
};

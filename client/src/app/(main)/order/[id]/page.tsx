'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OrderCompletion from '@/modules/orders/components/OrderCompletion';
import { Order, ChatMessage, OrderStatus } from '@/types/order';
import { ordersApi } from '@/lib/api/orders';
import toast from '@/lib/toast';

export default function OrderPage() {
    const params = useParams();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentUser, setCurrentUser] = useState<{
        id: string;
        role: string;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUser({ id: user.id, role: user.role });
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error parsing user:', error);
            router.push('/login');
        }
    }, [router]);

    // Fetch order data
    const fetchOrderData = useCallback(async () => {
        // params.id is productId from URL based on Seller Dashboard link
        if (!params.id || !currentUser) return;

        setIsLoading(true);
        try {
            const orderData = await ordersApi.getOrderByProduct(
                params.id as string,
            );

            if (orderData) {
                setOrder(orderData);
                // Fetch chat messages (mocked/stubbed for now if API missing)
                const messages = await ordersApi.getChatMessages(orderData.id);
                setChatMessages(messages);
            } else {
                console.log('Order not found via API');
            }
        } catch (error) {
            console.error('Failed to fetch order:', error);
            // Don't show error toast on 404, just let UI handle empty state if needed
        } finally {
            setIsLoading(false);
        }
    }, [params.id, currentUser]);

    useEffect(() => {
        if (currentUser) {
            void fetchOrderData();
        }
    }, [fetchOrderData, currentUser]);

    const handleUpdateOrder = async (updates: Partial<Order>) => {
        if (!order) return;

        try {
            let updatedOrder: Order | null = null;

            if (updates.paymentProof && updates.shippingAddress) {
                updatedOrder = await ordersApi.submitPaymentInfo(
                    order.productId,
                    {
                        paymentProof: updates.paymentProof,
                        shippingAddress: updates.shippingAddress,
                    },
                );
            } else if (updates.shippingInvoice) {
                updatedOrder = await ordersApi.confirmShipment(
                    order.productId,
                    {
                        shippingInvoice: updates.shippingInvoice,
                    },
                );
            } else if (updates.status === OrderStatus.COMPLETED) {
                updatedOrder = await ordersApi.confirmDelivery(order.productId);
            } else if (
                updates.sellerRating !== undefined ||
                updates.buyerRating !== undefined
            ) {
                await ordersApi.submitRating(order.productId, {
                    rating: updates.sellerRating || updates.buyerRating || 0,
                    comment:
                        updates.sellerComment || updates.buyerComment || '',
                    isSeller: !!updates.sellerRating,
                });
                // Since mock rating doesn't return updated order, update local state
                updatedOrder = { ...order, ...updates };
            }

            if (updatedOrder) {
                setOrder(updatedOrder);
                toast.success('Order updated successfully');
            }
        } catch (error) {
            console.error('Failed to update order:', error);
            toast.error('Failed to update order');
        }
    };

    const handleCancelOrder = async (reason: string) => {
        if (!order) return;

        try {
            const cancelledOrder = await ordersApi.cancelOrder(
                order.productId,
                reason,
            );
            setOrder(cancelledOrder);
            toast.warning('Order cancelled');
        } catch (error) {
            console.error('Failed to cancel order:', error);
            toast.error('Failed to cancel order');
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!order) return;

        try {
            // Chat API is likely missing on backend, so this might fail or return mock
            const newMessage = await ordersApi.sendChatMessage(
                order.id,
                message,
            );
            setChatMessages([...chatMessages, newMessage]);
        } catch (error) {
            // If API fails, mock it locally for UX demonstration
            console.error(
                'Failed to send message via API, adding locally:',
                error,
            );
            const mockMessage: ChatMessage = {
                id: Date.now().toString(),
                orderId: order.id,
                senderId: currentUser!.id,
                senderName: currentUser!.role === 'SELLER' ? 'Seller' : 'Buyer', // Simplify name
                message: message,
                timestamp: new Date(),
            };
            setChatMessages([...chatMessages, mockMessage]);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F87C1] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!order || !currentUser) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Order Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The order you're looking for doesn't exist or you don't
                        have access to it.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-dark-primary text-white rounded-lg hover:bg-primary"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const isSeller = currentUser?.id === order?.sellerId;
    const isBuyer = currentUser?.id === order?.buyerId;

    if (!isSeller && !isBuyer) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to view this order.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-[#5F87C1] text-white rounded-lg hover:bg-[#4A6B9C]"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-6 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="text-dark-primary hover:underline flex items-center"
                    >
                        ← Back to Product
                    </button>
                </div>

                <OrderCompletion
                    order={order}
                    currentUserId={currentUser.id}
                    isSeller={isSeller}
                    onUpdateOrder={handleUpdateOrder}
                    onCancelOrder={handleCancelOrder}
                    onSendMessage={handleSendMessage}
                    messages={chatMessages}
                />
            </div>
        </div>
    );
}

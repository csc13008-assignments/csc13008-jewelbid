'use client';

import { useState } from 'react';
import { Order, OrderStatus, ChatMessage } from '@/types/order';
import { Button } from '@/modules/shared/components/ui';
import { Upload, MessageSquare, CheckCircle, X } from 'lucide-react';

interface OrderCompletionProps {
    order: Order;
    currentUserId: string;
    isSeller: boolean;
    onUpdateOrder: (updates: Partial<Order>) => Promise<void>;
    onCancelOrder: (reason: string) => Promise<void>;
    onSendMessage: (message: string) => Promise<void>;
    messages: ChatMessage[];
}

export default function OrderCompletion({
    order,
    currentUserId,
    isSeller,
    onUpdateOrder,
    onCancelOrder,
    onSendMessage,
    messages,
}: OrderCompletionProps) {
    const [paymentProof, setPaymentProof] = useState('');
    const [shippingAddress, setShippingAddress] = useState(
        order.shippingAddress || '',
    );
    const [shippingInvoice, setShippingInvoice] = useState('');
    const [rating, setRating] = useState<number>(
        isSeller ? order.sellerRating || 0 : order.buyerRating || 0,
    );
    const [comment, setComment] = useState(
        isSeller ? order.sellerComment || '' : order.buyerComment || '',
    );
    const [chatMessage, setChatMessage] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const currentStep = (() => {
        switch (order.status) {
            case OrderStatus.PAYMENT_PENDING:
                return 1;
            case OrderStatus.SHIPPING_PENDING:
                return 2;
            case OrderStatus.DELIVERY_PENDING:
                return 3;
            case OrderStatus.COMPLETED:
            case OrderStatus.CANCELLED:
                return 4;
            default:
                return 1;
        }
    })();

    const handlePaymentSubmit = async () => {
        setLoading(true);
        try {
            await onUpdateOrder({
                paymentProof,
                shippingAddress,
                status: OrderStatus.SHIPPING_PENDING,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleShippingSubmit = async () => {
        setLoading(true);
        try {
            await onUpdateOrder({
                shippingInvoice,
                status: OrderStatus.DELIVERY_PENDING,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeliveryConfirm = async () => {
        setLoading(true);
        try {
            await onUpdateOrder({
                status: OrderStatus.COMPLETED,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingSubmit = async () => {
        setLoading(true);
        try {
            if (isSeller) {
                await onUpdateOrder({
                    sellerRating: rating,
                    sellerComment: comment,
                });
            } else {
                await onUpdateOrder({
                    buyerRating: rating,
                    buyerComment: comment,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a cancellation reason');
            return;
        }
        setLoading(true);
        try {
            await onCancelOrder(cancelReason);
            setShowCancelDialog(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSendChatMessage = async () => {
        if (!chatMessage.trim()) return;
        await onSendMessage(chatMessage);
        setChatMessage('');
    };

    if (order.status === OrderStatus.CANCELLED) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-red-800 mb-4">
                    Order Cancelled
                </h2>
                <p className="text-red-700 mb-2">
                    <strong>Reason:</strong> {order.cancelReason}
                </p>
                {order.sellerRating && (
                    <p className="text-red-700">
                        Seller rating applied:{' '}
                        {order.sellerRating === 1 ? '+1' : '-1'}
                    </p>
                )}
            </div>
        );
    }

    const steps = [
        { number: 1, label: 'Payment' },
        { number: 2, label: 'Shipping' },
        { number: 3, label: 'Delivery' },
        { number: 4, label: 'Rating' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-3xl font-bold mb-8">Order Completion</h2>

                {/* Improved Progress Steps */}
                <div className="mb-10">
                    <div className="relative flex justify-between items-start">
                        {/* Background Line */}
                        <div
                            className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"
                            style={{ zIndex: 0 }}
                        />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-dark-primary transition-all duration-500"
                            style={{
                                width: `${((currentStep - 1) / 3) * 100}%`,
                                zIndex: 1,
                            }}
                        />

                        {/* Steps */}
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="flex flex-col items-center relative"
                                style={{ flex: 1, zIndex: 2 }}
                            >
                                {/* Step Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        step.number <= currentStep
                                            ? 'bg-dark-primary text-white shadow-lg'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    } ${step.number === currentStep ? 'ring-4 ring-primary-100 scale-110' : ''}`}
                                >
                                    {step.number < currentStep ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        step.number
                                    )}
                                </div>

                                {/* Step Label */}
                                <p
                                    className={`text-sm mt-3 font-medium text-center whitespace-nowrap ${
                                        step.number <= currentStep
                                            ? 'text-black'
                                            : 'text-gray-400'
                                    }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="border-t pt-6">
                    {/* Step 1: Payment Proof */}
                    {currentStep === 1 && !isSeller && (
                        <div>
                            <span className="text-2xl text-dark-primary font-bold">
                                Step 1: Upload Payment Proof
                            </span>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mt-2 mb-2">
                                        Payment Proof Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPaymentProof(
                                                        reader.result as string,
                                                    );
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-dark-primary file:text-white file:cursor-pointer hover:file:bg-[hover:bg-dark-primary]"
                                    />
                                    {paymentProof && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Preview:
                                            </p>
                                            <img
                                                src={paymentProof}
                                                alt="Payment proof preview"
                                                className="max-w-md rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Shipping Address
                                    </label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) =>
                                            setShippingAddress(e.target.value)
                                        }
                                        placeholder="Enter your full shipping address"
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <Button
                                    variant="muted"
                                    size="lg"
                                    onClick={() => void handlePaymentSubmit()}
                                    disabled={
                                        loading ||
                                        !paymentProof ||
                                        !shippingAddress
                                    }
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Submit Payment Info
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && isSeller && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Waiting for buyer to upload payment proof...
                            </p>
                        </div>
                    )}

                    {/* Step 2: Shipping Confirmation */}
                    {currentStep === 2 && isSeller && (
                        <div>
                            <span className="text-2xl text-dark-primary font-bold">
                                Step 2: Confirm Payment & Shipping
                            </span>
                            <div className="bg-gray-50 p-4 rounded-lg mt-2 mb-4">
                                <h4 className="font-bold mb-2">
                                    Payment Proof
                                </h4>
                                {order.paymentProof && (
                                    <img
                                        src={order.paymentProof}
                                        alt="Payment proof"
                                        className="max-w-md rounded-lg"
                                    />
                                )}
                                <h4 className="font-bold mt-4 mb-2">
                                    Shipping Address
                                </h4>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {order.shippingAddress}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Shipping Invoice / Tracking Number
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingInvoice}
                                        onChange={(e) =>
                                            setShippingInvoice(e.target.value)
                                        }
                                        placeholder="Enter tracking number"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <Button
                                    variant="muted"
                                    size="lg"
                                    onClick={() => void handleShippingSubmit()}
                                    disabled={loading || !shippingInvoice}
                                >
                                    Confirm Payment Received & Shipped
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && !isSeller && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Waiting for seller to confirm payment and ship
                                the item...
                            </p>
                        </div>
                    )}

                    {/* Step 3: Delivery Confirmation */}
                    {currentStep === 3 && !isSeller && (
                        <div>
                            <span className="text-2xl text-dark-primary font-bold">
                                Step 3: Confirm Delivery
                            </span>
                            <div className="bg-gray-50 p-4 rounded-lg mt-2 mb-4">
                                <h4 className="font-bold mb-2">
                                    Tracking Information
                                </h4>
                                <p className="text-gray-700">
                                    {order.shippingInvoice}
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-700">
                                    Have you received the item in good
                                    condition?
                                </p>
                                <Button
                                    variant="muted"
                                    size="lg"
                                    onClick={() => void handleDeliveryConfirm()}
                                    disabled={loading}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm Delivery
                                </Button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && isSeller && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Waiting for buyer to confirm delivery...
                            </p>
                        </div>
                    )}

                    {/* Step 4: Rating */}
                    {currentStep === 4 && (
                        <div>
                            <span className="text-2xl text-dark-primary font-bold">
                                Step 4: Rate Transaction
                            </span>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mt-2 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setRating(1)}
                                            className={`px-6 py-3 rounded-lg border-2 font-bold ${
                                                rating === 1
                                                    ? 'bg-green-100 border-green-500 text-green-700'
                                                    : 'border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            👍 Positive (+1)
                                        </button>
                                        <button
                                            onClick={() => setRating(-1)}
                                            className={`px-6 py-3 rounded-lg border-2 font-bold ${
                                                rating === -1
                                                    ? 'bg-red-100 border-red-500 text-red-700'
                                                    : 'border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            👎 Negative (-1)
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Comment (optional)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        placeholder="Share your experience..."
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                </div>
                                <Button
                                    variant="muted"
                                    size="lg"
                                    onClick={() => void handleRatingSubmit()}
                                    disabled={loading || rating === 0}
                                >
                                    {(
                                        isSeller
                                            ? order.sellerRating
                                            : order.buyerRating
                                    )
                                        ? 'Update Rating'
                                        : 'Submit Rating'}
                                </Button>
                                {(isSeller
                                    ? order.sellerRating
                                    : order.buyerRating) && (
                                    <p className="text-sm text-gray-600">
                                        You can update your rating anytime.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Seller Cancel Button */}
                {isSeller && order.status !== OrderStatus.COMPLETED && (
                    <div className="mt-6 pt-6 border-t">
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => setShowCancelDialog(true)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Order
                        </Button>
                    </div>
                )}
            </div>

            {/* Chat Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center justify-between w-full mb-4"
                >
                    <h3 className="text-xl font-bold flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Chat with {isSeller ? 'Buyer' : 'Seller'}
                    </h3>
                    <span>{showChat ? '▼' : '▶'}</span>
                </button>

                {showChat && (
                    <div>
                        <div className="border rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    No messages yet. Start the conversation!
                                </p>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`mb-3 ${
                                            msg.senderId === currentUserId
                                                ? 'text-right'
                                                : ''
                                        }`}
                                    >
                                        <div
                                            className={`inline-block px-4 py-2 rounded-lg ${
                                                msg.senderId === currentUserId
                                                    ? 'bg-dark-primary text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            <p className="text-sm font-medium">
                                                {msg.senderName}
                                            </p>
                                            <p>{msg.message}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        void handleSendChatMessage();
                                    }
                                }}
                                placeholder="Type a message..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                            />
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => void handleSendChatMessage()}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Cancel Dialog */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to cancel this order? This
                            will automatically apply a -1 rating to the buyer.
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                        />
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => setShowCancelDialog(false)}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => void handleCancel()}
                                disabled={loading}
                                className="flex-1 bg-red-600 hover:bg-red-700"
                            >
                                Confirm Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

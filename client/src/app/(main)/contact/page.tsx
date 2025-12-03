'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '@/modules/shared/components/ui/Button';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        (async () => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log('Contact form submitted:', formData);
                setSubmitSuccess(true);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: '',
                });
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                setIsSubmitting(false);
            }
        })();
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="font-heading text-4xl font-normal text-black mb-8">
                            Get In Touch
                        </h2>
                        <p className="text-gray-600 text-lg mb-10">
                            Have questions about our auctions, need help with
                            your account, or want to list your jewelry? Our team
                            is here to help you every step of the way.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">
                                        Email
                                    </h3>
                                    <p className="text-gray-600">
                                        support@jewelbid.com
                                    </p>
                                    <p className="text-gray-600">
                                        sales@jewelbid.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">
                                        Phone
                                    </h3>
                                    <p className="text-gray-600">
                                        +84 (28) 1234-5678
                                    </p>
                                    <p className="text-gray-600">
                                        +84 (24) 8765-4321
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary/10  flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">
                                        Address
                                    </h3>
                                    <p className="text-gray-600">
                                        123 Nguyen Hue Street
                                        <br />
                                        District 1, Ho Chi Minh City
                                        <br />
                                        Vietnam 70000
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">
                                        Business Hours
                                    </h3>
                                    <p className="text-gray-600">
                                        Monday - Friday: 9:00 AM - 6:00 PM
                                    </p>
                                    <p className="text-gray-600">
                                        Saturday: 10:00 AM - 4:00 PM
                                    </p>
                                    <p className="text-gray-600">
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-secondary p-8">
                            <h2 className="font-heading text-3xl font-normal text-black mb-6">
                                Send us a Message
                            </h2>

                            {submitSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 ">
                                    <p className="text-green-700 font-medium">
                                        Thank you for your message! We&apos;ll
                                        get back to you within 24 hours.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-dark-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-dark-primary       focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <h2 className="font-heading text-4xl font-normal text-black text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white border border-primary p-6">
                            <h3 className="text-xl font-semibold text-black mb-3">
                                How do I start bidding?
                            </h3>
                            <p className="text-gray-600">
                                Simply create an account, browse our auctions,
                                and place your bids. Make sure to verify your
                                account for higher bidding limits.
                            </p>
                        </div>
                        <div className="bg-white border border-primary p-6">
                            <h3 className="text-xl font-semibold text-black mb-3">
                                How do I sell my jewelry?
                            </h3>
                            <p className="text-gray-600">
                                Contact our team for an evaluation. We&apos;ll
                                guide you through the authentication and listing
                                process to maximize your item&apos;s value.
                            </p>
                        </div>
                        <div className="bg-white border border-primary p-6">
                            <h3 className="text-xl font-semibold text-black mb-3">
                                Are all items authenticated?
                            </h3>
                            <p className="text-gray-600">
                                Yes, all jewelry goes through our rigorous
                                authentication process by certified experts
                                before being listed for auction.
                            </p>
                        </div>
                        <div className="bg-white border border-primary p-6      ">
                            <h3 className="text-xl font-semibold text-black mb-3">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-gray-600">
                                We accept all major credit cards, bank
                                transfers, and verified digital payment methods
                                for your convenience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

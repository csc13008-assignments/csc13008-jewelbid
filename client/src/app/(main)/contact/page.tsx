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
        void (async () => {
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
        <div className="min-h-screen bg-neutral-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-12">
                        <div>
                            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                                Get In Touch
                            </h2>
                            <p className="text-neutral-600 text-lg leading-relaxed">
                                Have questions about our auctions, need help
                                with your account, or want to list your jewelry?
                                Our team is here to help you every step of the
                                way.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        Email
                                    </h3>
                                    <p className="text-neutral-600 hover:text-dark-primary transition-colors">
                                        support@jewelbid.com
                                    </p>
                                    <p className="text-neutral-600 hover:text-dark-primary transition-colors">
                                        sales@jewelbid.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        Phone
                                    </h3>
                                    <p className="text-neutral-600">
                                        +84 (28) 1234-5678
                                    </p>
                                    <p className="text-neutral-600">
                                        +84 (24) 8765-4321
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        Address
                                    </h3>
                                    <p className="text-neutral-600 leading-relaxed">
                                        123 Nguyen Hue Street
                                        <br />
                                        District 1, Ho Chi Minh City
                                        <br />
                                        Vietnam 70000
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-6 h-6 text-dark-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                                        Business Hours
                                    </h3>
                                    <p className="text-neutral-600">
                                        Monday - Friday: 9:00 AM - 6:00 PM
                                    </p>
                                    <p className="text-neutral-600">
                                        Saturday: 10:00 AM - 4:00 PM
                                    </p>
                                    <p className="text-neutral-600">
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-primary/5 to-primary/5 rounded-3xl transform rotate-3 scale-105 blur-2xl"></div>
                        <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-neutral-100">
                            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-8">
                                Send us a Message
                            </h2>

                            {submitSuccess && (
                                <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                                    <p className="text-green-800 font-medium flex items-center">
                                        <span className="mr-2">✓</span>
                                        Thank you for your message! We&apos;ll
                                        get back to you within 24 hours.
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-bold text-neutral-700 mb-2"
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
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-bold text-neutral-700 mb-2"
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
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-bold text-neutral-700 mb-2"
                                    >
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block text-sm font-bold text-neutral-700 mb-2"
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
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-bold text-neutral-700 mb-2"
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
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center space-x-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all py-4 text-lg font-bold"
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

                <div className="mt-24">
                    <h2 className="font-heading text-3xl lg:text-4xl font-bold text-neutral-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-dark-primary transition-colors">
                                How do I start bidding?
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Simply create an account, browse our auctions,
                                and place your bids. Make sure to verify your
                                account for higher bidding limits.
                            </p>
                        </div>
                        <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-dark-primary transition-colors">
                                How do I sell my jewelry?
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Contact our team for an evaluation. We&apos;ll
                                guide you through the authentication and listing
                                process to maximize your item&apos;s value.
                            </p>
                        </div>
                        <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-dark-primary transition-colors">
                                Are all items authenticated?
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Yes, all jewelry goes through our rigorous
                                authentication process by certified experts
                                before being listed for auction.
                            </p>
                        </div>
                        <div className="bg-white border border-neutral-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                            <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-dark-primary transition-colors">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-neutral-600 leading-relaxed">
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

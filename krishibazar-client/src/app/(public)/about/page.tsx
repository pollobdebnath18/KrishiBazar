"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Handshake, Sprout, Store, CheckCircle2, CircleDollarSign, Smartphone, Phone, Mail, MapPin, Loader2, Send } from 'lucide-react';
import MobileKrishi from "@/assets/mobile_krishi.jpg"
import Image from 'next/image';
import { toast } from 'react-toastify';
import { createContact } from '@/lib/api/contact';

export default function AboutPage() {
    const features = [
        {
            icon: <Sprout className="w-8 h-8 text-green-600" />,
            title: "সরাসরি কৃষক থেকে",
            description: "কোনো মধ্যস্বত্বভোগী ছাড়া সরাসরি কৃষকের কাছ থেকে পণ্য কেনার নিশ্চয়তা।"
        },
        {
            icon: <Store className="w-8 h-8 text-green-600" />,
            title: "ন্যায্য মূল্য",
            description: "কৃষক পান তার পণ্যের সঠিক দাম, আর ক্রেতা পান বাজারের সেরা মূল্যে সতেজ পণ্য।"
        },
        {
            icon: <Handshake className="w-8 h-8 text-green-600" />,
            title: "নির্ভরযোগ্য প্ল্যাটফর্ম",
            description: "নিরাপদ লেনদেন এবং বিশ্বস্ত ক্রেতা-বিক্রেতা সম্পর্ক গড়ে তোলার মাধ্যম।"
        }
    ];

    const benefits = [
        "কৃষকদের জন্য সহজ বিক্রি প্রক্রিয়া",
        "তাজা ও বিষমুক্ত পণ্যের নিশ্চয়তা",
        "ডিজিটাল পেমেন্ট ব্যবস্থা",
        "সারাদেশে সহজলভ্য কৃষি পণ্য"
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createContact({
                name,
                email,
                subject,
                message,
            });

            toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে!");

            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
        } catch (err: any) {
            toast.error(err.message || "বার্তা পাঠাতে সমস্যা হয়েছে");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                        <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        কৃষিবাজার সম্পর্কে
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        কৃষিবাজার হলো একটি ডিজিটাল কৃষি মার্কেটপ্লেস যা সরাসরি কৃষক এবং ক্রেতাদের মধ্যে সেতুবন্ধন তৈরি করে। এই প্ল্যাটফর্মটি তৈরি করা হয়েছে যাতে কৃষকরা তাদের উৎপাদিত পণ্য সহজে বিক্রি করতে পারেন এবং ক্রেতারা ন্যায্য মূল্যে তাজা ও মানসম্মত কৃষি পণ্য পেতে পারেন।
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className=" p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl bg-green-100 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <div className="w-16 h-16 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 relative z-10">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed relative z-10">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                >
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 lg:gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    কৃষিবাজারের মূল লক্ষ্য হলো একটি আধুনিক, স্বচ্ছ এবং নির্ভরযোগ্য ডিজিটাল কৃষি মার্কেটপ্লেস তৈরি করা। আমরা চাই কৃষকরা যেন খুব সহজেই তাদের উৎপাদিত পণ্য বিক্রি করতে পারেন এবং ক্রেতারা ন্যায্য মূল্যে সতেজ ও মানসম্মত পণ্য পান।
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                        <CircleDollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">কৃষকদের ন্যায্য মূল্য</h4>
                                        <p className="text-sm text-gray-600">কৃষকদের তাদের পণ্যের সঠিক মূল্য পেতে সহায়তা করা।</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Handshake className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">সরাসরি কৃষক ও ক্রেতার সংযোগ</h4>
                                        <p className="text-sm text-gray-600">মধ্যস্বত্বভোগীর ওপর নির্ভরতা কমিয়ে সরাসরি সংযোগ তৈরি করা।</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Smartphone className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">সহজ ডিজিটাল বাজার ব্যবস্থা</h4>
                                        <p className="text-sm text-gray-600">কৃষকদের সহজে পণ্য যোগ ও বিক্রির সুযোগ দেওয়া।</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Leaf className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">তাজা ও মানসম্মত পণ্য</h4>
                                        <p className="text-sm text-gray-600">ক্রেতাদের কাছে ভালো ও তাজা কৃষিপণ্য পৌঁছে দেওয়া।</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={MobileKrishi}
                                alt="Mobile Krishi"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">যোগাযোগ করুন</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন। আমরা দ্রুত আপনার প্রশ্নের উত্তর দেওয়ার চেষ্টা করব।
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                    <Phone className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">ফোন</p>
                                    <p className="text-lg font-medium text-gray-900">+880 1780-589179</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">ইমেইল</p>
                                    <a href="mailto:support@krishibazar.com" className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors">support@krishibazar.com</a>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">ঠিকানা / লোকেশন</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        আখালিয়া, সিলেট, বাংলাদেশ
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">নাম</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="আপনার সম্পূর্ণ নাম"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">ইমেইল</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="আপনার ইমেইল অ্যাড্রেস"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">বিষয়</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                        placeholder="যোগাযোগের মূল বিষয়"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">বার্তা</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        placeholder="আপনার বার্তা এখানে লিখুন..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-gray-50 focus:bg-white resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>পাঠানো হচ্ছে...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>বার্তা পাঠান</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
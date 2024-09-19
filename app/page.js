'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 via-black to-purple-900 text-white flex flex-col">
            {/* Navigation Bar */}
            <header className="w-full py-5 flex justify-between items-center px-12 fixed top-0 bg-opacity-50 bg-black shadow-lg backdrop-blur-md z-50">
                {/* Left side of the navbar */}
                <div className="flex space-x-8">
                    <Link href="/" className="hover:text-gray-300 transition duration-300">Blog</Link>
                    <Link href="/" className="hover:text-gray-300 transition duration-300">Help</Link>
                    <Link href="/" className="hover:text-gray-300 transition duration-300">Community</Link>
                </div>

                {/* App Name with Stylish Font and Gradient */}
                <div className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                    Erinder
                </div>

                {/* Right side of the navbar */}
                <div className="flex space-x-6">
                    <Link href="/auth/signin" className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition duration-300">
                        Sign In
                    </Link>
                    <Link href="/auth/signup" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full hover:opacity-80 transition duration-300">
                        Create Account
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-6xl mx-auto px-4 py-32 flex flex-col items-center flex-grow">
                {/* Hero Section */}
                <section className="w-full text-center mb-24">
                    <h1 className="text-6xl font-extrabold mb-6">
                        Meet Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Task Manager</span>
                    </h1>
                    <p className="text-lg text-gray-300">Stay organized and keep your life on track with our cutting-edge reminder and task management system.</p>
                </section>

                {/* Animated Avatar or Background */}
                <section className="w-full h-[400px] mb-24 bg-cover bg-center rounded-xl shadow-2xl relative overflow-hidden" style={{ backgroundImage: "url('/your-avatar-image.gif')" }}>
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <h2 className="text-4xl font-bold text-white">Your AI Assistant Awaits</h2>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full text-center mb-24">
                    <h2 className="text-4xl font-semibold mb-6">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-4">Smart Reminders</h3>
                            <p className="text-gray-300">Never miss important events with smart, customizable reminders.</p>
                        </div>
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-4">Advanced Task Management</h3>
                            <p className="text-gray-300">Organize your tasks efficiently with AI-driven suggestions.</p>
                        </div>
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-4">Collaborative Features</h3>
                            <p className="text-gray-300">Work together seamlessly with task sharing and team collaboration.</p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="w-full text-center mb-24">
                    <h2 className="text-4xl font-semibold mb-6">Pricing Plans</h2>
                    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
                            <p className="text-xl">$5/month</p>
                            <p className="text-sm text-gray-400">Essential features for personal use.</p>
                        </div>
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                            <p className="text-xl">$10/month</p>
                            <p className="text-sm text-gray-400">Full suite of features for power users.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full text-center mb-24">
                    <h2 className="text-4xl font-semibold mb-6">What Our Users Say</h2>
                    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg">
                            <p className="text-gray-300">"A game-changer in task management. I feel more organized than ever!"</p>
                            <span className="block mt-4 font-bold">- Emily</span>
                        </div>
                        <div className="bg-black bg-opacity-60 p-6 rounded-lg shadow-lg">
                            <p className="text-gray-300">"The AI assistant is incredibly helpful. Highly recommended!"</p>
                            <span className="block mt-4 font-bold">- David</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-black text-white py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* About */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">About Erinder</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className="hover:underline">Our Story</Link></li>
                                <li><Link href="#" className="hover:underline">Press & Media</Link></li>
                            </ul>
                        </div>

                        {/* Help & Support */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Help & Support</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className="hover:underline">Help Center</Link></li>
                                <li><Link href="#" className="hover:underline">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Join Our Community */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Join Our Community</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className="hover:underline">Reddit</Link></li>
                                <li><Link href="#" className="hover:underline">Discord</Link></li>
                                <li><Link href="#" className="hover:underline">Facebook</Link></li>
                            </ul>
                        </div>

                        {/* Get the App */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Get the App</h4>
                            <ul className="space-y-2">
                                <li><Link href="#" className="hover:underline">iOS</Link></li>
                                <li><Link href="#" className="hover:underline">Android</Link></li>
                                <li><Link href="#" className="hover:underline">Oculus</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 text-center text-sm text-gray-400">
                        <p>Copyright © 2024 Hidai Bar-Mor. All rights reserved.</p>
                        <p className="mt-2">
                            <Link href="#" className="hover:underline">Terms of Service</Link> | 
                            <Link href="#" className="hover:underline ml-2">Privacy Policy</Link> | 
                            <Link href="#" className="hover:underline ml-2">Cookies Policy</Link> | 
                            <Link href="#" className="hover:underline ml-2">Cookie Settings</Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

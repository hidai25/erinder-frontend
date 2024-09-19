'use client';

import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <header className="w-full py-5 bg-blue-600 text-white text-center font-bold text-2xl">
                Welcome to Our Reminder & Task Management App
            </header>

            <main className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
                <section className="w-full mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Manage Your Reminders and Tasks Efficiently</h1>
                    <p className="text-lg text-gray-600">An all-in-one solution to keep track of your tasks, manage reminders, and stay organized.</p>
                </section>

                {/* Sign-in and Sign-up Section */}
                <section className="w-full flex justify-center mb-12">
                    <div className="flex space-x-6">
                        <Link href="/auth/signin">
                            <a className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Sign In</a>
                        </Link>
                        <Link href="/auth/signup">
                            <a className="px-8 py-4 bg-green-500 text-white rounded-md hover:bg-green-600">Sign Up</a>
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Reminders</h3>
                            <p>Set one-time or recurring reminders and never forget important events.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Task Management</h3>
                            <p>Create, categorize, and prioritize tasks with ease.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Shared Tasks</h3>
                            <p>Collaborate with family members and share tasks seamlessly.</p>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="w-full text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4">Pricing</h2>
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Basic Plan</h3>
                            <p className="text-lg">$5/month</p>
                            <p className="text-sm text-gray-500">Access to reminders and task management.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                            <p className="text-lg">$10/month</p>
                            <p className="text-sm text-gray-500">Includes shared tasks and advanced features.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full text-center mb-12">
                    <h2 className="text-3xl font-semibold mb-4">What Our Users Say</h2>
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600">"This app changed the way I organize my life. Highly recommend!"</p>
                            <span className="block mt-4 font-bold">- Alex</span>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-gray-600">"A must-have for anyone looking to stay on top of their tasks!"</p>
                            <span className="block mt-4 font-bold">- Maria</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

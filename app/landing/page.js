'use client';

import React from 'react';

export default function LandingPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-white">
            {/* Hero Section */}
            <section className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to Your Reminder & Task Management App</h1>
                <p className="text-xl mb-8">Organize your life and tasks effortlessly with our app.</p>
                {/* Signup/Login Modal Trigger */}
                <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300">
                    Sign In / Sign Up
                </button>
            </section>

            {/* Features Section */}
            <section className="w-full py-16 bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
                <div className="flex justify-around">
                    {/* Feature 1 */}
                    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Task Management</h3>
                        <p>Organize your tasks, set priorities, and assign tasks to family members with ease.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Reminders</h3>
                        <p>Set recurring reminders to ensure you never miss an important event or task.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Family Collaboration</h3>
                        <p>Share tasks and reminders with your family for seamless coordination.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="w-full py-16 bg-white">
                <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
                <div className="flex justify-around">
                    {/* Testimonial 1 */}
                    <div className="max-w-sm bg-gray-100 p-6 rounded-lg shadow-md">
                        <p>"This app has transformed how I manage my family's tasks. Absolutely love it!"</p>
                        <h4 className="mt-4 font-semibold">- Jane Doe</h4>
                    </div>
                    {/* Testimonial 2 */}
                    <div className="max-w-sm bg-gray-100 p-6 rounded-lg shadow-md">
                        <p>"I no longer forget important dates thanks to the reminder feature!"</p>
                        <h4 className="mt-4 font-semibold">- John Smith</h4>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="w-full py-16 bg-gray-100">
                <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
                <div className="flex justify-around">
                    {/* Plan 1 */}
                    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
                        <p>$5/month - Basic access to reminders and task management.</p>
                        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">Get Started</button>
                    </div>
                    {/* Plan 2 */}
                    <div className="max-w-md bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Premium Plan</h3>
                        <p>$10/month - Full access to all features, including family collaboration and premium support.</p>
                        <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition duration-300">Get Started</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-8 bg-white text-center">
                <p>© 2024 Your Reminder App. All rights reserved.</p>
            </footer>
        </main>
    );
}

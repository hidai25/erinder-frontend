'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await signIn('credentials', {
                redirect: false, // Disable automatic redirect
                email,
                password,
            });

            if (result.error) {
                setError(result.error);
            } else {
                window.location.href = '/dashboard'; // Redirect to the dashboard page after successful sign-in
            }
        } catch (err) {
            setError('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300">
                {/* Logo */}
                <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Erinder</h1>

                <h2 className="text-3xl font-extrabold text-center text-gray-900">Welcome Back</h2>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>
                    {/* Terms of Use and Privacy Policy */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        By signing up or logging in, you agree to our <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign In
                    </button>
                </form>
                <p className="text-sm text-center text-gray-700">
                    Don't have an account?{' '}
                    <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function Verify() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Verification failed');
            }

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300">
                <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Erinder</h1>

                <h2 className="text-3xl font-extrabold text-center text-gray-900">Enter Verification Code</h2>

                {success ? (
                    <div className="text-green-500 text-center">Verification successful! You can now sign in.</div>
                ) : (
                    error && <div className="text-red-500 text-center">{error}</div>
                )}

                {!success && (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Verification Code</label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Verify
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

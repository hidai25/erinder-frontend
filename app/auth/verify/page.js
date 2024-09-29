'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

export default function Verify() {
    const router = useRouter(); // Initialize useRouter
    const [code, setCode] = useState(new Array(6).fill('')); // Initialize an array for 6-digit code
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]); // Refs to control focus of input fields

    useEffect(() => {
        // Automatically focus on the first input on component mount
        inputRefs.current[0]?.focus();
    }, []);

    // Handles the input change for each digit
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value)) { // Check if the value is a digit
            const updatedCode = [...code];
            updatedCode[index] = value;
            setCode(updatedCode);

            // Move focus to the next input
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            } else {
                // Submit automatically when the last digit is entered
                handleVerify(updatedCode.join(''));
            }
        }
    };

    // Handles backspace key for navigating back and clearing input
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const updatedCode = [...code];
            
            if (code[index] === '') {
                // If the current input is empty, move to the previous input
                if (index > 0) {
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                // Clear the current input and stay on the same input
                updatedCode[index] = '';
                setCode(updatedCode);
            }
        }
    };

    const handleVerify = async (verificationCode) => {
        setLoading(true);
        try {
            const res = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: localStorage.getItem('email'), code: verificationCode }), // Email is fetched from localStorage
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/create-profile'); // Redirect to creat-profile page
            }, 2000);
        } catch (err) {
            setError('Invalid verification code.');
        } finally {
            setLoading(false);
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
                    <div className="flex justify-center space-x-2 mt-6">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)} // Assign ref for each input
                                className="w-12 h-12 text-center text-2xl border-b-2 border-gray-300 focus:outline-none focus:border-green-500 transition-all duration-300"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        householdName: '',
        familyMembers: [{ name: '', age: '', picture: '' }]
    });
    const [error, setError] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFamilyMemberChange = (index, field, value) => {
        const updatedMembers = [...formData.familyMembers];
        updatedMembers[index][field] = value;
        setFormData(prev => ({ ...prev, familyMembers: updatedMembers }));
    };

    const addFamilyMember = () => {
        setFormData(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, { name: '', age: '', picture: '' }]
        }));
    };

    const handleImageChange = (index, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedMembers = [...formData.familyMembers];
            updatedMembers[index].picture = reader.result;
            setFormData(prev => ({ ...prev, familyMembers: updatedMembers }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const sendVerificationCode = async () => {
        try {
            const res = await fetch('/api/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            if (!res.ok) throw new Error(await res.text());
            
            setVerificationSent(true);
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(await res.text());

            localStorage.setItem('email', formData.email);
            
            if (!verificationSent) {
                await sendVerificationCode();
            }
            
            router.push('/auth/verify');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all hover:scale-105 duration-300">
                <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Erinder</h1>
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Create Your Account</h2>

                {error && <div className="text-red-500 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                        name="householdName"
                        type="text"
                        required
                        value={formData.householdName}
                        onChange={handleInputChange}
                        placeholder="Household Name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />

                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Family Members</h3>
                        {formData.familyMembers.map((member, index) => (
                            <div key={index} className="space-y-2 mt-4">
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                    placeholder={`Family Member ${index + 1} Name`}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                />
                                <input
                                    type="number"
                                    value={member.age}
                                    onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                                    placeholder="Age (optional)"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                />
                                <label className="block text-sm font-medium text-gray-700">Upload Photo (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                                    className="block w-full text-sm text-gray-500"
                                />
                                {member.picture && (
                                    <img src={member.picture} alt={`Family Member ${index + 1}`} className="mt-2 w-16 h-16 rounded-full object-cover" />
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFamilyMember}
                            className="mt-2 text-green-500 hover:text-green-700"
                        >
                            + Add Another Family Member
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By signing up, you agree to our <a href="#" className="underline">Terms of Use</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-700">
                    Already have an account?{' '}
                    <a href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateProfile() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        householdName: '',
        familyMembers: [{ name: '', age: '', picture: '' }]
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) {
            setError('User email not found. Please log in again.');
            router.push('/auth/signin');
        } else {
            setUserEmail(email);
        }
    }, [router]);

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
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedMembers = [...formData.familyMembers];
                updatedMembers[index].picture = reader.result;
                setFormData(prev => ({ ...prev, familyMembers: updatedMembers }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/create-profile', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-user-email': userEmail,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'An error occurred while creating profile');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/signin');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
            <div className="w-full max-w-md space-y-8 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-105 duration-300">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Erinder</h1>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Create Your Profile</h2>
                </div>

                {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">{error}</div>}

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="text-green-500 text-xl font-semibold">
                            Profile created successfully!
                        </div>
                        <div className="text-gray-600">
                            Redirecting you to sign in...
                        </div>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="householdName" className="block text-sm font-medium text-gray-700">
                                Household Name
                            </label>
                            <input
                                id="householdName"
                                name="householdName"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                                value={formData.householdName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Family Members</h3>
                            {formData.familyMembers.map((member, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                                    <input
                                        type="text"
                                        value={member.name}
                                        onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                        placeholder={`Family Member ${index + 1} Name`}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={member.age}
                                        onChange={(e) => handleFamilyMemberChange(index, 'age', e.target.value)}
                                        placeholder="Age (optional)"
                                        className="mt-3 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <div className="mt-3">
                                        <label className="block text-sm font-medium text-gray-700">Upload Photo (optional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                        />
                                    </div>
                                    {member.picture && (
                                        <div className="mt-3 flex justify-center">
                                            <Image 
                                                src={member.picture} 
                                                alt={`Family Member ${index + 1}`} 
                                                width={100} 
                                                height={100} 
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFamilyMember}
                                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                + Add Another Family Member
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={loading}
                            >
                                {loading ? 'Creating Profile...' : 'Create Profile'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
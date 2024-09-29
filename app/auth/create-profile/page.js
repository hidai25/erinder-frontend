'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProfile() {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        householdName: '',
        familyMembers: [{ name: '', age: '', picture: '' }]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleFamilyMemberChange = (index, field, value) => {
        const updatedMembers = [...profileData.familyMembers];
        updatedMembers[index][field] = value;
        setProfileData(prev => ({ ...prev, familyMembers: updatedMembers }));
    };

    const addFamilyMember = () => {
        setProfileData(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, { name: '', age: '', picture: '' }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch('/api/create-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'An error occurred while creating profile');
            }

            router.push('/dashboard'); // Redirect to the dashboard after profile creation
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Create Your Profile</h2>

                {error && <div className="text-red-500 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="householdName"
                        type="text"
                        required
                        value={profileData.householdName}
                        onChange={handleInputChange}
                        placeholder="Household Name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    />

                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Family Members</h3>
                        {profileData.familyMembers.map((member, index) => (
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
                                    onChange={(e) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const updatedMembers = [...profileData.familyMembers];
                                            updatedMembers[index].picture = reader.result;
                                            setProfileData(prev => ({ ...prev, familyMembers: updatedMembers }));
                                        };
                                        if (e.target.files[0]) {
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
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

                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        disabled={loading}
                    >
                        {loading ? 'Creating Profile...' : 'Create Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

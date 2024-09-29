import clientPromise from '../../lib/mongodb';

export async function POST(request) {
    try {
        // Parse the request body, which contains household name and family members
        const { householdName, familyMembers } = await request.json();

        // Retrieve the user's email from the request headers or session
        const email = request.headers.get('x-user-email'); // Or use your auth method to get user email

        // Ensure the user email is present
        if (!email) {
            return new Response(JSON.stringify({ message: 'User not authenticated' }), { status: 401 });
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('erinder'); // Replace with your actual database name

        // Find the user by email and update their profile information
        const result = await db.collection('users').updateOne(
            { email }, // Find user by their email
            { 
                $set: { 
                    householdName, 
                    familyMembers 
                } 
            }
        );

        // Check if the user exists and the profile was successfully updated
        if (result.matchedCount === 0) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }
        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ message: 'Failed to update profile' }), { status: 400 });
        }

        // Respond with success
        return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error creating profile:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
}

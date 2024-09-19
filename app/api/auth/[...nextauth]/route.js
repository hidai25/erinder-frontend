import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; // Ensure the correct path to your MongoDB connection
import { compare } from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Connect to MongoDB
                const client = await clientPromise;
                const db = client.db('erinder'); // Replace with your actual database name

                // Find the user by email
                const user = await db.collection('users').findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('No user found with this email');
                }

                // Validate password
                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error('Invalid password');
                }

                // Return user data
                return { id: user._id, name: user.name, email: user.email };
            },
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Attach user ID to the token
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Attach user ID to the session object
            session.user.id = token.id;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Always redirect to the dashboard after sign-in
            return `${baseUrl}/dashboard`;
        },
    },
    pages: {
        // Specify custom pages for sign-in
        signIn: '/auth/signin', // Redirect to the custom sign-in page
        error: '/auth/signin', // Redirect to the custom sign-in page on error
    },
    // No custom sign-up handling here, as it's managed separately
};

// Export the handlers for NextAuth
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

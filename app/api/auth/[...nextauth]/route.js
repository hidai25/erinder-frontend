import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AppleProvider from 'next-auth/providers/apple';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; // Path to MongoDB connection setup
import { compare } from 'bcryptjs';

export const authOptions = {
    providers: [
        // Credentials provider for email/password authentication
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Your email' },
                password: { label: 'Password', type: 'password', placeholder: 'Your password' },
            },
            async authorize(credentials) {
                const client = await clientPromise; // Get the MongoDB client
                const db = client.db('erinder'); // Use the correct database name

                // Find the user by email
                const user = await db.collection('users').findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('No user found with this email');
                }

                // Validate password using bcrypt
                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error('Invalid password');
                }

                // Return the user object upon successful authentication
                return { id: user._id, name: user.name, email: user.email };
            },
        }),
        
        // Apple OAuth Provider
        AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,
        }),

        // Facebook OAuth Provider
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),

        // Google OAuth Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],

    // MongoDB Adapter for managing user data
    adapter: MongoDBAdapter(clientPromise),

    // Define NextAuth.js secret for encryption
    secret: process.env.NEXTAUTH_SECRET,

    // JWT-based session strategy
    session: {
        strategy: 'jwt',
    },

    // Define custom callbacks
    callbacks: {
        // JWT callback to attach user ID to token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // Session callback to include user ID in the session object
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            return session;
        },

        // Redirect callback to ensure users are directed to dashboard
        async redirect({ url, baseUrl }) {
            return baseUrl + '/dashboard'; // Always redirect to dashboard
        },
    },

    // Custom pages
    pages: {
        signIn: '/auth/signin', // Custom sign-in page
        error: '/auth/signin', // Redirect to sign-in page on errors
    },
};

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

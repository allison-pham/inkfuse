import connectDB from '../../../../lib/mongo';
import User from '../../../../Model/user';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function POST(request) {
    try {
        await connectDB();
        
        // Get email and password from request body
        const { email, password } = await request.json();

        // Find user by email
        const user = await User.findOne({ email });
        
        // If user not found, return error
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Compare password with hashed password in database
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Generate JWT token
        const token = await new SignJWT({ 
            username: user.username,
            email: user.email,
            id: user._id 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));

        // Set cookie with JWT token
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return new Response(JSON.stringify({ 
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 
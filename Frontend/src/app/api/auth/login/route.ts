import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface JavaAuthResponse {
  token: string;
}

const JAVA_API_BASE_URL = process.env.BACKEND_API_API_BASE_URL;

// Logs user in with existing account
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Make login request
    const javaBackendUrl = `${JAVA_API_BASE_URL}/auth/login`;
    const response = await fetch(javaBackendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Java Backend Login Error:', errorData);
      return NextResponse.json(
        { message: `Login failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Extract token
    const data: JavaAuthResponse = await response.json();
    const token = data.token;

    if (!token) {
      console.error('No token received from Java backend');
      return NextResponse.json(
        { message: 'Login failed: No token received' },
        { status: 500 }
      );
    }

    // Store token as HttpOnly cookie
    const cookieStore = cookies();
    cookieStore.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    });

    // Successful login
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error: any) {
    console.error('Login API Route Error:', error);
    return NextResponse.json(
      { message: `An internal server error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}

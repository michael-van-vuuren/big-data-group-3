import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Clear auth cookie
    const cookieStore = cookies();
    cookieStore.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: -1, 
    });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });

  } catch (error: any) {
    console.error('Logout API Route Error:', error);
    return NextResponse.json(
      { message: `An internal server error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}

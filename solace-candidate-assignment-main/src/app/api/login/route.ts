import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { users } from '../../../db/schema';
import { withDbConnection } from '../../../db/connection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const result = await withDbConnection(async (db) => {

      const userResults = await db.select().from(users).where(eq(users.username, username));
      
      if (userResults.length === 0) {
        return { success: false, message: 'Invalid username or password' };
      }

      const foundUser = userResults[0];

      if (foundUser.password !== password) {
        return { success: false, message: 'Invalid username or password' };
      }

      //update login count
      await db
        .update(users)
        .set({ 
          numberOfLogins: foundUser.numberOfLogins + 1,
          dateUpdated: new Date()
        })
        .where(eq(users.id, foundUser.id));

      return {
        success: true,
        data: {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          numberOfLogins: foundUser.numberOfLogins + 1,
          dateCreated: foundUser.dateCreated,
          dateUpdated: new Date()
        }
      };
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use POST for login.' },
    { status: 405 }
  );
} 
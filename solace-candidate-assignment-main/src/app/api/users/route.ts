import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from '../../../db/schema';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    const queryClient = postgres(process.env.DATABASE_URL);
    const db = drizzle(queryClient);

    const allUsers = await db.select().from(users);

    await queryClient.end();

    const safeUsers = allUsers.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role,
      numberOfLogins: user.numberOfLogins,
      dateCreated: user.dateCreated,
      dateUpdated: user.dateUpdated
    }));

    return NextResponse.json({
      success: true,
      data: safeUsers,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role = 'USER' } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    const queryClient = postgres(process.env.DATABASE_URL);
    const db = drizzle(queryClient);

    const existingUsers = await db.select().from(users).where(eq(users.username, username));
    if (existingUsers.length > 0) {
      await queryClient.end();
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 400 }
      );
    }

    const newUsers = await db.insert(users).values({
      username,
      password,
      role: role as 'ADMIN' | 'USER' | 'ADVOCATE'
    }).returning();

    await queryClient.end();

    const safeUser = {
      id: newUsers[0].id,
      username: newUsers[0].username,
      role: newUsers[0].role,
      numberOfLogins: newUsers[0].numberOfLogins,
      dateCreated: newUsers[0].dateCreated,
      dateUpdated: newUsers[0].dateUpdated
    };

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, username, password, role } = body;

    if (!id || !username) {
      return NextResponse.json(
        { success: false, message: 'ID and username are required' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    const queryClient = postgres(process.env.DATABASE_URL);
    const db = drizzle(queryClient);

    const existingUsers = await db.select().from(users).where(eq(users.id, id));
    if (existingUsers.length === 0) {
      await queryClient.end();
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      username,
      dateUpdated: new Date()
    };

    if (password) {
      updateData.password = password;
    }

    if (role) {
      updateData.role = role;
    }

    const updatedUsers = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    await queryClient.end();

    const safeUser = {
      id: updatedUsers[0].id,
      username: updatedUsers[0].username,
      role: updatedUsers[0].role,
      numberOfLogins: updatedUsers[0].numberOfLogins,
      dateCreated: updatedUsers[0].dateCreated,
      dateUpdated: updatedUsers[0].dateUpdated
    };

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    const queryClient = postgres(process.env.DATABASE_URL);
    const db = drizzle(queryClient);

    const existingUsers = await db.select().from(users).where(eq(users.id, id));
    if (existingUsers.length === 0) {
      await queryClient.end();
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const deletedUsers = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    await queryClient.end();

    const safeUser = {
      id: deletedUsers[0].id,
      username: deletedUsers[0].username,
      role: deletedUsers[0].role,
      numberOfLogins: deletedUsers[0].numberOfLogins,
      dateCreated: deletedUsers[0].dateCreated,
      dateUpdated: deletedUsers[0].dateUpdated
    };

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
} 
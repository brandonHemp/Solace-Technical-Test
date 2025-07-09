import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
let tasks = [
  { id: 1, title: 'Complete project setup', description: 'Set up the development environment', completed: false },
  { id: 2, title: 'Create API endpoints', description: 'Build REST API for the application', completed: true },
  { id: 3, title: 'Write documentation', description: 'Create comprehensive API documentation', completed: false }
];

let nextId = 4;

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    data: tasks,
    message: 'Tasks retrieved successfully' 
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, completed = false } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    const newTask = {
      id: nextId++,
      title,
      description: description || '',
      completed
    };

    tasks.push(newTask);

    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, completed } = body;

    if (!id || completed === undefined) {
      return NextResponse.json(
        { success: false, message: 'ID and completed status are required' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    tasks[taskIndex].completed = completed;

    return NextResponse.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task status updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Task ID is required' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Task not found' },
        { status: 404 }
      );
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    );
  }
} 
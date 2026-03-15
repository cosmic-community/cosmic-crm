import { NextResponse } from 'next/server';
import { createActivityEntry } from '@/lib/cosmic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.action_type || !body.description) {
      return NextResponse.json(
        { error: 'action_type and description are required' },
        { status: 400 }
      );
    }

    const entry = await createActivityEntry({
      action_type: body.action_type,
      description: body.description,
      contact: body.contact || '',
      details: body.details || '',
      performed_by: body.performed_by || 'System',
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating activity entry:', error);
    return NextResponse.json(
      { error: 'Failed to create activity entry' },
      { status: 500 }
    );
  }
}
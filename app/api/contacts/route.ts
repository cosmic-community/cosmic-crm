import { NextResponse } from 'next/server';
import { createContact, createActivityEntry } from '@/lib/cosmic';
import type { ContactFormData } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactFormData;

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const contact = await createContact(body);

    // Log the activity
    try {
      await createActivityEntry({
        action_type: 'Contact Created',
        description: `New contact "${body.name}" was created`,
        contact: contact.id,
        performed_by: 'Dashboard User',
      });
    } catch {
      // Activity logging is non-critical
    }

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
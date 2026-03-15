// app/api/contacts/[id]/route.ts
import { NextResponse } from 'next/server';
import { updateContact, deleteContact, createActivityEntry } from '@/lib/cosmic';
import type { ContactFormData } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<ContactFormData>;

    const contact = await updateContact(id, body);

    // Log the activity
    try {
      await createActivityEntry({
        action_type: 'Contact Updated',
        description: `Contact "${body.name || 'Unknown'}" was updated`,
        contact: id,
        performed_by: 'Dashboard User',
      });
    } catch {
      // Activity logging is non-critical
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteContact(id);

    // Log the activity
    try {
      await createActivityEntry({
        action_type: 'Status Change',
        description: 'A contact was deleted from the CRM',
        performed_by: 'Dashboard User',
      });
    } catch {
      // Activity logging is non-critical
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
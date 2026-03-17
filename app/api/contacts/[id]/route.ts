// app/api/contacts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getContactById, updateContact, deleteContact, createActivityEntry } from '@/lib/cosmic';
import type { ContactFormData } from '@/types';
import { hasStatus } from '@/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate the contact exists before attempting update
    const existing = await getContactById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Contact not found: ${id}` },
        { status: 404 }
      );
    }

    const body = (await request.json()) as Partial<ContactFormData>;
    const contact = await updateContact(id, body);

    // Log the activity
    try {
      await createActivityEntry({
        action_type: 'Contact Updated',
        description: `Contact "${body.name || existing.metadata?.name || 'Unknown'}" was updated`,
        contact: id,
        performed_by: 'Dashboard User',
      });
    } catch {
      // Activity logging is non-critical
    }

    return NextResponse.json({ contact });
  } catch (error) {
    const status = hasStatus(error) ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Failed to update contact';
    console.error('Error updating contact:', message, error);
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate the contact exists before attempting delete
    const existing = await getContactById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Contact not found: ${id}` },
        { status: 404 }
      );
    }

    await deleteContact(id);

    // Log the activity
    try {
      await createActivityEntry({
        action_type: 'Status Change',
        description: `Contact "${existing.metadata?.name || 'Unknown'}" was deleted from the CRM`,
        performed_by: 'Dashboard User',
      });
    } catch {
      // Activity logging is non-critical
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const status = hasStatus(error) ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Failed to delete contact';
    console.error('Error deleting contact:', message, error);
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
import { createBucketClient } from '@cosmicjs/sdk';
import type {
  CRMContact,
  ActivityLogEntry,
  CRMSettings,
  EmailSequence,
  EmailTemplate,
  ContactFormData,
} from '@/types';
import { hasStatus } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging',
});

// Helper to extract a meaningful error message from any error type
function extractErrorMessage(error: unknown): string {
  // Log the full raw error for debugging
  try {
    console.error('[Cosmic SDK Raw Error]', JSON.stringify(error, null, 2));
  } catch {
    console.error('[Cosmic SDK Raw Error] (non-serializable)', error);
  }

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    // Check common error shape properties
    if (typeof err.message === 'string') return err.message;
    if (typeof err.error === 'string') return err.error;
    if (err.data && typeof err.data === 'object') {
      const data = err.data as Record<string, unknown>;
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }
    if (err.body && typeof err.body === 'object') {
      const body = err.body as Record<string, unknown>;
      if (typeof body.message === 'string') return body.message;
      if (typeof body.error === 'string') return body.error;
    }
    // Last resort: stringify the whole thing
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error (non-serializable object)';
    }
  }
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

// ========== CRM CONTACTS ==========

export async function getContacts(): Promise<CRMContact[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'crm-contacts' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    return (response.objects || []) as CRMContact[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch contacts');
  }
}

export async function getContactBySlug(slug: string): Promise<CRMContact | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'crm-contacts',
      slug,
    }).props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at']).depth(1);
    return response.object as CRMContact;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch contact');
  }
}

export async function getContactById(id: string): Promise<CRMContact | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'crm-contacts',
      id,
    }).props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at']).depth(1);
    return response.object as CRMContact;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch contact by ID');
  }
}

export async function createContact(data: ContactFormData): Promise<CRMContact> {
  const response = await cosmic.objects.insertOne({
    type: 'crm-contacts',
    title: data.name,
    metadata: {
      name: data.name,
      email: data.email,
      company: data.company,
      job_title: data.job_title,
      phone: data.phone,
      status: data.status || 'Lead',
      lead_source: data.lead_source,
      notes: data.notes || '',
      lifetime_value: data.lifetime_value || '0',
      last_activity_date: new Date().toISOString(),
    },
  });
  return response.object as CRMContact;
}

export async function updateContact(id: string, data: Partial<ContactFormData>): Promise<CRMContact> {
  const metadata: Record<string, unknown> = {};
  if (data.name !== undefined) metadata.name = data.name;
  if (data.email !== undefined) metadata.email = data.email;
  if (data.company !== undefined) metadata.company = data.company;
  if (data.job_title !== undefined) metadata.job_title = data.job_title;
  if (data.phone !== undefined) metadata.phone = data.phone;
  if (data.status !== undefined) metadata.status = data.status;
  if (data.lead_source !== undefined) metadata.lead_source = data.lead_source;
  if (data.notes !== undefined) metadata.notes = data.notes;
  if (data.lifetime_value !== undefined) metadata.lifetime_value = data.lifetime_value;
  metadata.last_activity_date = new Date().toISOString();

  const updatePayload: Record<string, unknown> = { metadata };
  if (data.name !== undefined) updatePayload.title = data.name;

  console.log(`[updateContact] Attempting update for contact ${id}`, JSON.stringify(updatePayload));

  try {
    const response = await cosmic.objects.updateOne(id, updatePayload);
    return response.object as CRMContact;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      throw Object.assign(new Error(`Contact not found: ${id}`), { status: 404 });
    }
    const message = extractErrorMessage(error);
    console.error(`[updateContact] Failed for contact ${id}:`, message);
    throw Object.assign(new Error(`Failed to update contact: ${message}`), { status: 500 });
  }
}

export async function deleteContact(id: string): Promise<void> {
  try {
    await cosmic.objects.deleteOne(id);
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      throw Object.assign(new Error(`Contact not found: ${id}`), { status: 404 });
    }
    const message = extractErrorMessage(error);
    console.error(`[deleteContact] Failed for contact ${id}:`, message);
    throw Object.assign(new Error(`Failed to delete contact: ${message}`), { status: 500 });
  }
}

// ========== ACTIVITY LOG ==========

export async function getActivityLog(): Promise<ActivityLogEntry[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'activity-log' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1);
    const entries = (response.objects || []) as ActivityLogEntry[];
    return entries.sort((a, b) => {
      const dateA = new Date(a.metadata?.action_date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.action_date || b.created_at).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch activity log');
  }
}

export async function getContactActivity(contactId: string): Promise<ActivityLogEntry[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'activity-log', 'metadata.contact': contactId })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1);
    const entries = (response.objects || []) as ActivityLogEntry[];
    return entries.sort((a, b) => {
      const dateA = new Date(a.metadata?.action_date || a.created_at).getTime();
      const dateB = new Date(b.metadata?.action_date || b.created_at).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch contact activity');
  }
}

export async function createActivityEntry(data: {
  action_type: string;
  description: string;
  contact?: string;
  details?: string;
  performed_by?: string;
}): Promise<ActivityLogEntry> {
  const response = await cosmic.objects.insertOne({
    type: 'activity-log',
    title: `${data.action_type}: ${data.description}`.slice(0, 100),
    metadata: {
      action_type: data.action_type,
      description: data.description,
      contact: data.contact || '',
      details: data.details || '',
      performed_by: data.performed_by || 'System',
      action_date: new Date().toISOString(),
    },
  });
  return response.object as ActivityLogEntry;
}

// ========== CRM SETTINGS ==========

export async function getSettings(): Promise<CRMSettings | null> {
  try {
    const response = await cosmic.objects
      .find({ type: 'crm-settings' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at', 'modified_at'])
      .depth(1);
    const settings = response.objects as CRMSettings[];
    if (!settings || settings.length === 0) {
      return null;
    }
    return settings[0] as CRMSettings;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch settings');
  }
}

export async function updateSettings(id: string, data: Record<string, unknown>): Promise<CRMSettings> {
  const response = await cosmic.objects.updateOne(id, { metadata: data });
  return response.object as CRMSettings;
}

// ========== EMAIL SEQUENCES ==========

export async function getEmailSequences(): Promise<EmailSequence[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-sequences' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1);
    return (response.objects || []) as EmailSequence[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email sequences');
  }
}

// ========== EMAIL TEMPLATES ==========

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-templates' })
      .props(['id', 'slug', 'title', 'metadata', 'created_at'])
      .depth(1);
    return (response.objects || []) as EmailTemplate[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email templates');
  }
}
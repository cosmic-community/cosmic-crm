// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, unknown>;
  type: string;
  created_at: string;
  modified_at: string;
}

// CRM Contact
export interface CRMContact extends CosmicObject {
  type: 'crm-contacts';
  metadata: {
    name?: string;
    email?: string;
    company?: string;
    job_title?: string;
    phone?: string;
    status?: string;
    lead_source?: string;
    avatar?: {
      url: string;
      imgix_url: string;
    };
    last_activity_date?: string;
    notes?: string;
    lifetime_value?: string | number;
  };
}

// Activity Log
export interface ActivityLogEntry extends CosmicObject {
  type: 'activity-log';
  metadata: {
    action_type?: string;
    description?: string;
    contact?: CRMContact | string;
    details?: string;
    performed_by?: string;
    action_date?: string;
  };
}

// CRM Settings
export interface CRMSettings extends CosmicObject {
  type: 'crm-settings';
  metadata: {
    cron_schedule?: string;
    auto_welcome_email?: boolean | string;
    welcome_email_template?: EmailTemplate | string;
    inactive_threshold_days?: string | number;
    notification_email?: string;
    re_engagement_enabled?: boolean | string;
    app_name?: string;
  };
}

// Email Sequence
export interface EmailSequence extends CosmicObject {
  type: 'email-sequences';
  metadata: {
    sequence_name?: string;
    description?: string;
    trigger?: string;
    target_audience?: string;
    total_emails?: string | number;
    duration_days?: string | number;
    status?: string;
    emails_sent?: string | number;
    open_rate?: string | number;
    click_rate?: string | number;
    conversion_rate?: string | number;
  };
}

// Email Template
export interface EmailTemplate extends CosmicObject {
  type: 'email-templates';
  metadata: {
    subject_line?: string;
    preview_text?: string;
    email_body?: string;
    sequence?: EmailSequence | string;
    send_day?: string | number;
    email_order?: string | number;
    cta_text?: string;
    cta_link?: string;
    category?: string;
    emails_sent?: string | number;
    open_rate?: string | number;
    click_rate?: string | number;
  };
}

// User Signup
export interface UserSignup extends CosmicObject {
  type: 'user-signups';
  metadata: {
    email?: string;
    signup_date?: string;
    source?: string;
    referral_code?: string;
    plan?: string;
    user_status?: string;
    last_login?: string;
    email_sequence?: EmailSequence | string;
    emails_received?: string | number;
    lifetime_value?: string | number;
    notes?: string;
  };
}

// Contact form data for create/update
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  job_title: string;
  phone: string;
  status: string;
  lead_source: string;
  notes: string;
  lifetime_value: string;
}

// Settings form data
export interface SettingsFormData {
  cron_schedule: string;
  auto_welcome_email: boolean;
  inactive_threshold_days: number;
  notification_email: string;
  re_engagement_enabled: boolean;
  app_name: string;
}

// API Response types
export interface CosmicListResponse<T> {
  objects: T[];
  total: number;
}

// Contact status types — aligned with CMS crm-contacts schema
export type ContactStatus =
  | 'New'
  | 'Lead'
  | 'Prospect'
  | 'Qualified'
  | 'Welcome Email Sent'
  | 'Onboarding'
  | 'Onboarded'
  | 'Active'
  | 'Customer'
  | 'Inactive'
  | 'Churned';

// Activity action types — aligned with CMS activity-log schema
export type ActionType =
  | 'Email Sent'
  | 'Status Change'
  | 'User Created'
  | 'Contact Created'
  | 'Contact Updated'
  | 'Meeting Scheduled'
  | 'Cron Job'
  | 'Note Added'
  | 'Manual Action'
  | 'Login'
  | 'Signup';

// Helper to safely extract string value from select-dropdown metafields
export function getMetafieldValue(field: unknown): string {
  if (field === null || field === undefined) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);
  if (typeof field === 'object' && field !== null && 'value' in field) {
    return String((field as { value: unknown }).value);
  }
  if (typeof field === 'object' && field !== null && 'key' in field) {
    return String((field as { key: unknown }).key);
  }
  return '';
}

// Helper to check error status
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}
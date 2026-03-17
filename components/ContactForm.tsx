'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CRMContact, ContactFormData } from '@/types';
import { getMetafieldValue } from '@/types';

interface ContactFormProps {
  contact?: CRMContact;
  mode: 'create' | 'edit';
}

export default function ContactForm({ contact, mode }: ContactFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ContactFormData>({
    name: contact?.metadata?.name || contact?.title || '',
    email: contact?.metadata?.email || '',
    company: getMetafieldValue(contact?.metadata?.company),
    job_title: getMetafieldValue(contact?.metadata?.job_title),
    phone: contact?.metadata?.phone || '',
    status: getMetafieldValue(contact?.metadata?.status) || 'Lead',
    lead_source: getMetafieldValue(contact?.metadata?.lead_source) || '',
    notes: contact?.metadata?.notes || '',
    lifetime_value: String(contact?.metadata?.lifetime_value || '0'),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (mode === 'create') {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create contact');
        }
        router.push('/contacts');
        router.refresh();
      } else if (contact) {
        const res = await fetch(`/api/contacts/${contact.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update contact');
        }
        router.push(`/contacts/${contact.slug}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="label">Full Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="label">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
            placeholder="Acme Inc."
          />
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="job_title" className="label">Job Title</label>
          <input
            id="job_title"
            name="job_title"
            type="text"
            value={formData.job_title}
            onChange={handleChange}
            className="input-field"
            placeholder="VP of Engineering"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="label">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="label">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="New">New</option>
            <option value="Lead">Lead</option>
            <option value="Prospect">Prospect</option>
            <option value="Qualified">Qualified</option>
            <option value="Welcome Email Sent">Welcome Email Sent</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Onboarded">Onboarded</option>
            <option value="Active">Active</option>
            <option value="Customer">Customer</option>
            <option value="Inactive">Inactive</option>
            <option value="Churned">Churned</option>
          </select>
        </div>

        {/* Lead Source */}
        <div>
          <label htmlFor="lead_source" className="label">Lead Source</label>
          <select
            id="lead_source"
            name="lead_source"
            value={formData.lead_source}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a source...</option>
            <option value="Organic">Organic</option>
            <option value="Referral">Referral</option>
            <option value="Paid">Paid</option>
            <option value="Social">Social</option>
            <option value="Manual">Manual</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Cold Outreach">Cold Outreach</option>
            <option value="Website">Website</option>
            <option value="Event">Event</option>
            <option value="Conference">Conference</option>
            <option value="Demo Request">Demo Request</option>
            <option value="Content Marketing">Content Marketing</option>
          </select>
        </div>

        {/* Lifetime Value */}
        <div>
          <label htmlFor="lifetime_value" className="label">Lifetime Value ($)</label>
          <input
            id="lifetime_value"
            name="lifetime_value"
            type="number"
            min="0"
            step="0.01"
            value={formData.lifetime_value}
            onChange={handleChange}
            className="input-field"
            placeholder="0"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label htmlFor="notes" className="label">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className="input-field"
          placeholder="Additional notes about this contact..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
            ? 'Create Contact'
            : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CRMContact } from '@/types';
import { getMetafieldValue } from '@/types';
import StatusBadge from '@/components/StatusBadge';

interface ContactProfileProps {
  contact: CRMContact;
}

export default function ContactProfile({ contact }: ContactProfileProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const name = contact.metadata?.name || contact.title;
  const email = contact.metadata?.email || '';
  const company = getMetafieldValue(contact.metadata?.company);
  const jobTitle = getMetafieldValue(contact.metadata?.job_title);
  const phone = contact.metadata?.phone || '';
  const leadSource = getMetafieldValue(contact.metadata?.lead_source);
  const notes = contact.metadata?.notes || '';
  const ltv = parseFloat(String(contact.metadata?.lifetime_value || '0'));
  const avatarUrl = contact.metadata?.avatar?.imgix_url;
  const lastActivity = contact.metadata?.last_activity_date;

  const initials = name
    ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/contacts');
        router.refresh();
      } else {
        alert('Failed to delete contact.');
        setDeleting(false);
      }
    } catch {
      alert('An error occurred.');
      setDeleting(false);
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4 flex-1">
          {avatarUrl ? (
            <img
              src={`${avatarUrl}?w=160&h=160&fit=crop&auto=format,compress`}
              alt={name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-crm-100 text-crm-700 flex items-center justify-center text-xl font-bold ring-2 ring-white shadow-md">
              {initials}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-500">{jobTitle}{jobTitle && company ? ' at ' : ''}{company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/contacts/${contact.slug}/edit`} className="btn-secondary text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Edit
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger text-sm">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
            <p className="text-sm text-gray-900 mt-1">{email || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
            <p className="text-sm text-gray-900 mt-1">{phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company</p>
            <p className="text-sm text-gray-900 mt-1">{company || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</p>
            <p className="text-sm text-gray-900 mt-1">{jobTitle || '—'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
            <div className="mt-1">
              <StatusBadge status={contact.metadata?.status} />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Source</p>
            <p className="text-sm text-gray-900 mt-1">{leadSource || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lifetime Value</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {isNaN(ltv) ? '$0' : `$${ltv.toLocaleString()}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</p>
            <p className="text-sm text-gray-900 mt-1">
              {lastActivity ? new Date(lastActivity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="px-6 pb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Notes</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {notes}
          </div>
        </div>
      )}
    </div>
  );
}
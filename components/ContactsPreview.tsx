import Link from 'next/link';
import type { CRMContact } from '@/types';
import { getMetafieldValue } from '@/types';
import StatusBadge from '@/components/StatusBadge';

interface ContactsPreviewProps {
  contacts: CRMContact[];
}

export default function ContactsPreview({ contacts }: ContactsPreviewProps) {
  const previewContacts = contacts.slice(0, 5);

  return (
    <div className="card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Recent Contacts</h3>
        <Link href="/contacts" className="text-sm font-medium text-crm-600 hover:text-crm-700">
          View all →
        </Link>
      </div>
      {previewContacts.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No contacts found.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {previewContacts.map((contact) => {
            const avatarUrl = contact.metadata?.avatar?.imgix_url;
            const name = contact.metadata?.name || contact.title;
            const initials = name
              ? name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : '??';

            return (
              <Link
                key={contact.id}
                href={`/contacts/${contact.slug}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
              >
                {avatarUrl ? (
                  <img
                    src={`${avatarUrl}?w=80&h=80&fit=crop&auto=format,compress`}
                    alt={name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-crm-100 text-crm-700 flex items-center justify-center text-sm font-semibold">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {getMetafieldValue(contact.metadata?.company) || 'No company'}
                  </p>
                </div>
                <StatusBadge status={contact.metadata?.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
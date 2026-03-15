import Link from 'next/link';
import type { CRMContact } from '@/types';
import { getMetafieldValue } from '@/types';
import StatusBadge from '@/components/StatusBadge';

interface ContactsTableProps {
  contacts: CRMContact[];
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <h3 className="text-base font-semibold text-gray-900">No contacts found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                Contact
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                Company
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                Lead Source
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">
                Lifetime Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contacts.map((contact) => {
              const name = contact.metadata?.name || contact.title;
              const email = contact.metadata?.email || '';
              const avatarUrl = contact.metadata?.avatar?.imgix_url;
              const initials = name
                ? name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : '??';
              const ltv = parseFloat(String(contact.metadata?.lifetime_value || '0'));

              return (
                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/contacts/${contact.slug}`} className="flex items-center gap-3 group">
                      {avatarUrl ? (
                        <img
                          src={`${avatarUrl}?w=80&h=80&fit=crop&auto=format,compress`}
                          alt={name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-crm-100 text-crm-700 flex items-center justify-center text-xs font-semibold">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-crm-600 transition-colors">
                          {name}
                        </p>
                        <p className="text-xs text-gray-500">{email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {getMetafieldValue(contact.metadata?.company) || '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getMetafieldValue(contact.metadata?.job_title) || ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={contact.metadata?.status} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">
                      {getMetafieldValue(contact.metadata?.lead_source) || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {isNaN(ltv) ? '$0' : `$${ltv.toLocaleString()}`}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
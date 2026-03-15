import Link from 'next/link';
import { getContacts } from '@/lib/cosmic';
import ContactSearch from '@/components/ContactSearch';
import ContactsTable from '@/components/ContactsTable';
import { getMetafieldValue } from '@/types';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface ContactsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const { q, status } = await searchParams;
  const allContacts = await getContacts();

  let filteredContacts = allContacts;

  if (q) {
    const query = q.toLowerCase();
    filteredContacts = filteredContacts.filter((c) => {
      const name = (c.metadata?.name || c.title || '').toLowerCase();
      const email = (c.metadata?.email || '').toLowerCase();
      const company = getMetafieldValue(c.metadata?.company).toLowerCase();
      return name.includes(query) || email.includes(query) || company.includes(query);
    });
  }

  if (status) {
    filteredContacts = filteredContacts.filter(
      (c) => getMetafieldValue(c.metadata?.status) === status
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link href="/contacts/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Contact
        </Link>
      </div>

      {/* Search & Filter */}
      <Suspense fallback={<div className="h-11 bg-gray-100 rounded-lg animate-pulse" />}>
        <ContactSearch />
      </Suspense>

      {/* Table */}
      <ContactsTable contacts={filteredContacts} />
    </div>
  );
}
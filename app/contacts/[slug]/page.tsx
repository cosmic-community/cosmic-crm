// app/contacts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContactBySlug, getContactActivity } from '@/lib/cosmic';
import ContactProfile from '@/components/ContactProfile';
import ContactActivityFeed from '@/components/ContactActivityFeed';
import type { ActivityLogEntry } from '@/types';

export const dynamic = 'force-dynamic';

interface ContactDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  const { slug } = await params;
  const contact = await getContactBySlug(slug);

  if (!contact) {
    notFound();
  }

  let activities: ActivityLogEntry[] = [];
  try {
    activities = await getContactActivity(contact.id);
  } catch {
    activities = [];
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/contacts" className="text-gray-500 hover:text-crm-600 transition-colors">
          Contacts
        </Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium">{contact.metadata?.name || contact.title}</span>
      </nav>

      {/* Profile */}
      <ContactProfile contact={contact} />

      {/* Activity */}
      <ContactActivityFeed activities={activities} />
    </div>
  );
}
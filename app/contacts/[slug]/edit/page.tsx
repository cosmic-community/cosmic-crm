// app/contacts/[slug]/edit/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContactBySlug } from '@/lib/cosmic';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

interface EditContactPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditContactPage({ params }: EditContactPageProps) {
  const { slug } = await params;
  const contact = await getContactBySlug(slug);

  if (!contact) {
    notFound();
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
        <Link href={`/contacts/${contact.slug}`} className="text-gray-500 hover:text-crm-600 transition-colors">
          {contact.metadata?.name || contact.title}
        </Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium">Edit</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update information for {contact.metadata?.name || contact.title}.
        </p>
      </div>

      <ContactForm contact={contact} mode="edit" />
    </div>
  );
}
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export default function NewContactPage() {
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
        <span className="text-gray-900 font-medium">New Contact</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Contact</h1>
        <p className="text-sm text-gray-500 mt-1">Add a new contact to your CRM.</p>
      </div>

      <ContactForm mode="create" />
    </div>
  );
}
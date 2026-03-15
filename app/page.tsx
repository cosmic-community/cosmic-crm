import { getContacts, getActivityLog } from '@/lib/cosmic';
import DashboardMetrics from '@/components/DashboardMetrics';
import RecentActivity from '@/components/RecentActivity';
import ContactsPreview from '@/components/ContactsPreview';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [contacts, activities] = await Promise.all([
    getContacts(),
    getActivityLog(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back. Here&apos;s an overview of your CRM.
        </p>
      </div>

      {/* Metrics */}
      <DashboardMetrics contacts={contacts} activities={activities} />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ContactsPreview contacts={contacts} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
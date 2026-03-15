import { getActivityLog } from '@/lib/cosmic';
import ActivityList from '@/components/ActivityList';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const activities = await getActivityLog();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} recorded
        </p>
      </div>

      <ActivityList activities={activities} />
    </div>
  );
}
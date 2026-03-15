import type { ActivityLogEntry } from '@/types';
import { getMetafieldValue } from '@/types';

interface RecentActivityProps {
  activities: ActivityLogEntry[];
}

const actionIcons: Record<string, string> = {
  'Email Sent': '✉️',
  'Status Change': '🔄',
  'Note Added': '📝',
  'Contact Created': '➕',
  'Contact Updated': '✏️',
  'Cron Job': '⚙️',
  Login: '🔑',
  Signup: '🎉',
};

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Unknown date';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Unknown date';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const recentItems = activities.slice(0, 8);

  if (recentItems.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-sm text-gray-500 text-center py-8">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentItems.map((entry) => {
          const actionType = getMetafieldValue(entry.metadata?.action_type);
          const icon = actionIcons[actionType] || '📋';
          return (
            <div key={entry.id} className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {entry.metadata?.description || entry.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">
                    {getMetafieldValue(entry.metadata?.performed_by) || 'System'}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(entry.metadata?.action_date || entry.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
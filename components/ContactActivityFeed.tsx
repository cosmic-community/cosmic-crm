import type { ActivityLogEntry } from '@/types';
import { getMetafieldValue } from '@/types';

interface ContactActivityFeedProps {
  activities: ActivityLogEntry[];
}

const actionColors: Record<string, string> = {
  'Email Sent': 'bg-blue-100 text-blue-700',
  'Status Change': 'bg-amber-100 text-amber-700',
  'Note Added': 'bg-gray-100 text-gray-700',
  'Contact Created': 'bg-green-100 text-green-700',
  'Contact Updated': 'bg-indigo-100 text-indigo-700',
  'Cron Job': 'bg-purple-100 text-purple-700',
  Login: 'bg-teal-100 text-teal-700',
  Signup: 'bg-pink-100 text-pink-700',
};

export default function ContactActivityFeed({ activities }: ContactActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
        <p className="text-sm text-gray-500 text-center py-6">No activity recorded for this contact.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-6">
          {activities.map((entry) => {
            const actionType = getMetafieldValue(entry.metadata?.action_type);
            const colorClass = actionColors[actionType] || 'bg-gray-100 text-gray-700';
            const date = entry.metadata?.action_date || entry.created_at;

            return (
              <div key={entry.id} className="relative flex gap-4 pl-10">
                <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${colorClass}`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                      {actionType || 'Action'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {date ? new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'Unknown date'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {entry.metadata?.description || entry.title}
                  </p>
                  {entry.metadata?.details && (
                    <p className="text-xs text-gray-500 mt-1">{entry.metadata.details}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    by {getMetafieldValue(entry.metadata?.performed_by) || 'System'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
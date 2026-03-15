import { getMetafieldValue } from '@/types';

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700 ring-green-600/20',
  Inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  Lead: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Prospect: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  Customer: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Churned: 'bg-red-50 text-red-700 ring-red-600/20',
};

export default function StatusBadge({ status }: { status: unknown }) {
  const statusText = getMetafieldValue(status);
  const colorClass = statusColors[statusText] || 'bg-gray-50 text-gray-600 ring-gray-500/20';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${colorClass}`}
    >
      {statusText || 'Unknown'}
    </span>
  );
}
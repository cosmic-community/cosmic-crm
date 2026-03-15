'use client';

import { useState } from 'react';
import type { ActivityLogEntry } from '@/types';
import { getMetafieldValue } from '@/types';
import type { CRMContact } from '@/types';

interface ActivityListProps {
  activities: ActivityLogEntry[];
}

const actionColors: Record<string, string> = {
  'Email Sent': 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'Status Change': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'Note Added': 'bg-gray-50 text-gray-700 ring-gray-500/20',
  'Contact Created': 'bg-green-50 text-green-700 ring-green-600/20',
  'Contact Updated': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  'Cron Job': 'bg-purple-50 text-purple-700 ring-purple-600/20',
  Login: 'bg-teal-50 text-teal-700 ring-teal-600/20',
  Signup: 'bg-pink-50 text-pink-700 ring-pink-600/20',
};

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

export default function ActivityList({ activities }: ActivityListProps) {
  const [filter, setFilter] = useState('');

  const actionTypes = Array.from(
    new Set(activities.map((a) => getMetafieldValue(a.metadata?.action_type)).filter(Boolean))
  );

  const filtered = filter
    ? activities.filter((a) => getMetafieldValue(a.metadata?.action_type) === filter)
    : activities;

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === ''
              ? 'bg-crm-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({activities.length})
        </button>
        {actionTypes.map((type) => {
          const count = activities.filter(
            (a) => getMetafieldValue(a.metadata?.action_type) === type
          ).length;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === type
                  ? 'bg-crm-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {actionIcons[type] || '📋'} {type} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-sm text-gray-500">No activity entries found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const actionType = getMetafieldValue(entry.metadata?.action_type);
            const colorClass =
              actionColors[actionType] || 'bg-gray-50 text-gray-700 ring-gray-500/20';
            const icon = actionIcons[actionType] || '📋';
            const date = entry.metadata?.action_date || entry.created_at;
            const contact = entry.metadata?.contact;
            let contactName = '';
            if (contact && typeof contact === 'object' && 'title' in contact) {
              contactName = (contact as CRMContact).title || '';
            }

            return (
              <div key={entry.id} className="card p-4 flex items-start gap-4">
                <span className="text-xl mt-0.5 shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${colorClass}`}
                    >
                      {actionType || 'Action'}
                    </span>
                    {contactName && (
                      <span className="text-xs text-gray-500">
                        → {contactName}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 mt-1">
                    {entry.metadata?.description || entry.title}
                  </p>
                  {entry.metadata?.details && (
                    <p className="text-xs text-gray-500 mt-1">{entry.metadata.details}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{getMetafieldValue(entry.metadata?.performed_by) || 'System'}</span>
                    <span>·</span>
                    <span>
                      {date
                        ? new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
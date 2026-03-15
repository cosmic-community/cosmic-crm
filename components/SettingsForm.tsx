'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CRMSettings } from '@/types';
import { getMetafieldValue } from '@/types';

interface SettingsFormProps {
  settings: CRMSettings | null;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    app_name: settings?.metadata?.app_name || 'Cosmic CRM',
    cron_schedule: settings?.metadata?.cron_schedule || '0 9 * * *',
    auto_welcome_email:
      settings?.metadata?.auto_welcome_email === true ||
      settings?.metadata?.auto_welcome_email === 'true',
    inactive_threshold_days: Number(settings?.metadata?.inactive_threshold_days || 30),
    notification_email: settings?.metadata?.notification_email || '',
    re_engagement_enabled:
      settings?.metadata?.re_engagement_enabled === true ||
      settings?.metadata?.re_engagement_enabled === 'true',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(e.target.value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: settings?.id,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings');
      }

      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          Settings saved successfully!
        </div>
      )}

      {/* General */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="app_name" className="label">Application Name</label>
            <input
              id="app_name"
              name="app_name"
              type="text"
              value={formData.app_name}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="notification_email" className="label">Notification Email</label>
            <input
              id="notification_email"
              name="notification_email"
              type="email"
              value={formData.notification_email}
              onChange={handleChange}
              className="input-field"
              placeholder="admin@example.com"
            />
          </div>
        </div>
      </div>

      {/* Automation */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Automation</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cron_schedule" className="label">Cron Schedule</label>
              <input
                id="cron_schedule"
                name="cron_schedule"
                type="text"
                value={formData.cron_schedule}
                onChange={handleChange}
                className="input-field"
                placeholder="0 9 * * *"
              />
              <p className="text-xs text-gray-400 mt-1">
                Standard cron expression (e.g., &quot;0 9 * * *&quot; = daily at 9 AM)
              </p>
            </div>
            <div>
              <label htmlFor="inactive_threshold_days" className="label">
                Inactive Threshold (days)
              </label>
              <input
                id="inactive_threshold_days"
                name="inactive_threshold_days"
                type="number"
                min="1"
                value={formData.inactive_threshold_days}
                onChange={handleChange}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1">
                Days of inactivity before a contact is marked inactive
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto Welcome Email</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automatically send a welcome email to new contacts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="auto_welcome_email"
                  checked={formData.auto_welcome_email}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-crm-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-600" />
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Re-engagement Emails</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automatically send re-engagement emails to inactive contacts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="re_engagement_enabled"
                  checked={formData.re_engagement_enabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-crm-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-crm-600" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
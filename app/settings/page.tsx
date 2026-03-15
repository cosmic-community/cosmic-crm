import { getSettings } from '@/lib/cosmic';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure your CRM automation and preferences.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
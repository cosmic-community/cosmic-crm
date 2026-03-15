import { NextResponse } from 'next/server';
import { updateSettings } from '@/lib/cosmic';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Settings ID is required' },
        { status: 400 }
      );
    }

    const metadata: Record<string, unknown> = {};
    if (body.app_name !== undefined) metadata.app_name = body.app_name;
    if (body.cron_schedule !== undefined) metadata.cron_schedule = body.cron_schedule;
    if (body.auto_welcome_email !== undefined) metadata.auto_welcome_email = body.auto_welcome_email;
    if (body.inactive_threshold_days !== undefined) metadata.inactive_threshold_days = body.inactive_threshold_days;
    if (body.notification_email !== undefined) metadata.notification_email = body.notification_email;
    if (body.re_engagement_enabled !== undefined) metadata.re_engagement_enabled = body.re_engagement_enabled;

    const settings = await updateSettings(body.id, metadata);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { requireInstructor } from '@/lib/lms/utils';
import { AdminNotificationService } from '@/lib/admin-notifications/service';

export async function GET() {
  try {
    let user;
    try {
      user = await requireInstructor();
    } catch (authError: any) {
      return NextResponse.json({ error: authError.message }, { status: authError.message === 'Unauthorized' ? 401 : 403 });
    }
    const stats = await AdminNotificationService.getStats(user.id);
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching admin notification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin notification stats' }, { status: 500 });
  }
}

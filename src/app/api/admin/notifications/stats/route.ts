import { NextResponse } from 'next/server';
import { requireInstructor } from '@/lib/lms/utils';
import { AdminNotificationService } from '@/lib/admin-notifications/service';

export async function GET() {
  try {
    const user = await requireInstructor();
    const stats = await AdminNotificationService.getStats(user.id);
    return NextResponse.json(stats);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching admin notification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch admin notification stats' }, { status: 500 });
  }
}

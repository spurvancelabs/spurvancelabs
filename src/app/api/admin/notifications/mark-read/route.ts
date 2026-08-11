import { NextRequest, NextResponse } from 'next/server';
import { requireInstructor } from '@/lib/lms/utils';
import { AdminNotificationService } from '@/lib/admin-notifications/service';

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireInstructor();

    const body = await request.json();
    const { notification_ids, mark_all } = body;

    if (!mark_all && (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0)) {
      return NextResponse.json({
        error: 'Notification IDs required or mark_all must be true',
      }, { status: 400 });
    }

    const updatedCount = mark_all
      ? await AdminNotificationService.markAllAsRead(user.id)
      : await AdminNotificationService.markAsRead(user.id, notification_ids);

    return NextResponse.json({ success: true, updatedCount });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error marking admin notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark admin notifications as read' }, { status: 500 });
  }
}

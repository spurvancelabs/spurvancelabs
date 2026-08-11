import { NextRequest, NextResponse } from 'next/server';
import { requireInstructor } from '@/lib/lms/utils';
import { AdminNotificationService } from '@/lib/admin-notifications/service';

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireInstructor();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    let deletedCount = 0;
    if (deleteAll) {
      deletedCount = await AdminNotificationService.deleteAllNotifications(user.id);
    } else if (id) {
      const deleted = await AdminNotificationService.deleteNotification(user.id, id);
      deletedCount = deleted ? 1 : 0;
    } else {
      return NextResponse.json({ error: 'Notification id or deleteAll=true is required' }, { status: 400 });
    }

    return NextResponse.json({ success: true, deletedCount });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error deleting admin notifications:', error);
    return NextResponse.json({ error: 'Failed to delete admin notifications' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { requireInstructor } from '@/lib/lms/utils';
import { AdminNotificationService } from '@/lib/admin-notifications/service';
import { AdminNotificationFilter, AdminNotificationPriority, AdminNotificationType } from '@/lib/admin-notifications/types';

export async function GET(request: NextRequest) {
  try {
    const user = await requireInstructor();

    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('type');
    const priorityParam = searchParams.get('priority');

    const filter: AdminNotificationFilter = {
      type: typeParam
        ? (typeParam.includes(',')
            ? typeParam.split(',') as AdminNotificationType[]
            : typeParam as AdminNotificationType)
        : undefined,
      read: searchParams.get('read') === 'true' ? true
        : searchParams.get('read') === 'false' ? false
        : undefined,
      priority: priorityParam
        ? (priorityParam.includes(',')
            ? priorityParam.split(',') as AdminNotificationPriority[]
            : priorityParam as AdminNotificationPriority)
        : undefined,
      search: searchParams.get('search') || undefined,
    };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await AdminNotificationService.getNotifications(user.id, filter, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch admin notifications' }, { status: 500 });
  }
}

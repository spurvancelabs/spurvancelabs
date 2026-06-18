import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { NotificationFilter, NotificationType, NotificationPriority } from '@/lib/notification/types';

async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromCookie();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();

    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('type');
    const priorityParam = searchParams.get('priority');
    const filter: NotificationFilter = {
      type: typeParam ? (typeParam.includes(',') ? typeParam.split(',') as NotificationType[] : typeParam as NotificationType) : undefined,
      read: searchParams.get('read') === 'true' ? true : 
            searchParams.get('read') === 'false' ? false : undefined,
      priority: priorityParam ? (priorityParam.includes(',') ? priorityParam.split(',') as NotificationPriority[] : priorityParam as NotificationPriority) : undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      search: searchParams.get('search') || undefined,
    };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let dbQuery = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filter.type) {
      if (Array.isArray(filter.type)) {
        dbQuery = dbQuery.in('type', filter.type);
      } else {
        dbQuery = dbQuery.eq('type', filter.type);
      }
    }

    if (filter.read !== undefined) {
      dbQuery = dbQuery.eq('read', filter.read);
    }

    if (filter.priority) {
      if (Array.isArray(filter.priority)) {
        dbQuery = dbQuery.in('priority', filter.priority);
      } else {
        dbQuery = dbQuery.eq('priority', filter.priority);
      }
    }

    if (filter.from) {
      dbQuery = dbQuery.gte('created_at', filter.from);
    }

    if (filter.to) {
      dbQuery = dbQuery.lte('created_at', filter.to);
    }

    if (filter.search) {
      dbQuery = dbQuery.or(`title.ilike.%${filter.search}%,message.ilike.%${filter.search}%`);
    }

    dbQuery = dbQuery.range(from, to) as any;

    const { data: notifications, count, error } = await dbQuery;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

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

    // Get total and unread counts
    const { data: totalData, error: totalError, count: totalCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);

    if (totalError) {
      throw new Error(`Failed to get stats: ${totalError.message}`);
    }

    const { data: unreadData, error: unreadError, count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);

    if (unreadError) {
      throw new Error(`Failed to get stats: ${unreadError.message}`);
    }

    // Get counts by type
    const { data: typeData, error: typeError } = await supabase
      .from('notifications')
      .select('type')
      .eq('user_id', userId);

    if (typeError) {
      throw new Error(`Failed to get stats by type: ${typeError.message}`);
    }

    const byType = typeData?.reduce((acc: any, curr: any) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    // Get counts by priority
    const { data: priorityData, error: priorityError } = await supabase
      .from('notifications')
      .select('priority')
      .eq('user_id', userId);

    if (priorityError) {
      throw new Error(`Failed to get stats by priority: ${priorityError.message}`);
    }

    const byPriority = priorityData?.reduce((acc: any, curr: any) => {
      acc[curr.priority] = (acc[curr.priority] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      total: totalCount || 0,
      unread: unreadCount || 0,
      by_type: byType || {},
      by_priority: byPriority || {},
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    return NextResponse.json({ error: 'Failed to fetch notification stats' }, { status: 500 });
  }
}
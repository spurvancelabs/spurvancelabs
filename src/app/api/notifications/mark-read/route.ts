import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

async function getUserIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  try {
    const decoded = await verifyToken(token);
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserIdFromCookie();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();

    const body = await request.json();
    const { notification_ids, mark_all } = body;

    if (!mark_all && (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0)) {
      return NextResponse.json({
        error: 'Notification IDs required or mark_all must be true'
      }, { status: 400 });
    }

    let updatedCount = 0;

    if (mark_all) {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('read', false)
        .select();

      if (error) {
        throw error;
      }
      updatedCount = data?.length || 0;
    } else {
      const { data, error } = await supabase
        .from('notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .in('id', notification_ids)
        .eq('user_id', userId)
        .select();

      if (error) {
        throw error;
      }
      updatedCount = data?.length || 0;
    }

    return NextResponse.json({
      success: true,
      updatedCount,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
  }
}
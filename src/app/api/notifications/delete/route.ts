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

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromCookie();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const deleteAll = url.searchParams.get('deleteAll');

    if (!id && deleteAll !== 'true') {
      return NextResponse.json({
        error: 'Notification ID required or deleteAll must be true'
      }, { status: 400 });
    }

    let deletedCount = 0;

    if (deleteAll === 'true') {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .select();

      if (error) {
        throw error;
      }
      deletedCount = data?.length || 0;
    } else {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id as string)
        .eq('user_id', userId)
        .select();

      if (error) {
        throw error;
      }
      deletedCount = data?.length || 0;
    }

    return NextResponse.json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ error: 'Failed to delete notifications' }, { status: 500 });
  }
}
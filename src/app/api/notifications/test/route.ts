import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

// Simple endpoint to create a test notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title = 'Test Notification', message = 'This is a test' } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const notificationData = {
      user_id: userId,
      type: 'info',
      title,
      message,
      priority: 'medium',
      read: false,
      data: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await getSupabaseAdminClient()
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating test notification:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      notification: data,
      message: 'Test notification saved successfully' 
    });
  } catch (error: any) {
    console.error('Test notification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
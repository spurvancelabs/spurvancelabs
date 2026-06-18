import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CreateNotificationInput } from '@/lib/notification/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    const body: CreateNotificationInput = await request.json();

    if (!body.user_id || !body.type || !body.title || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notificationData = {
      user_id: body.user_id,
      type: body.type,
      title: body.title,
      message: body.message,
      priority: body.priority || 'medium',
      read: false,
      data: body.data || {},
      link: body.link || null,
      sender_id: body.sender_id || null,
      sender_name: body.sender_name || null,
      sender_avatar: body.sender_avatar || null,
      expires_at: body.expires_at || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
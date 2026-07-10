import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { requireViewer } from '@/lib/lms/utils';

export async function GET() {
  try {
    await requireViewer();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = await verifyToken(token!);

    const supabase = getSupabaseAdminClient();
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, type')
      .eq('id', decoded!.userId)
      .single();

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('user_id', decoded!.userId)
      .single();

    if (user) {
      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: adminUser?.role || user.type,
      });
    }

    const { data: authUser } = await supabase.auth.admin.getUserById(decoded!.userId);

    return NextResponse.json({
      id: decoded!.userId,
      name: authUser?.user?.user_metadata?.name || null,
      email: authUser?.user?.email || '',
      role: adminUser?.role || 'ADMIN',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireViewer();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const decoded = await verifyToken(token!);

    const { name, currentPassword, newPassword } = await request.json();

    if (!name && !newPassword) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    if (name) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', decoded!.userId)
        .single();

      if (existingUser) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ name })
          .eq('id', decoded!.userId);
        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase.auth.admin.updateUserById(decoded!.userId, {
          user_metadata: { name },
        });
        if (updateError) throw updateError;
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
      }

      const { error: authError } = await supabase.auth.admin.updateUserById(decoded!.userId, {
        password: newPassword,
      });

      if (authError) throw authError;
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

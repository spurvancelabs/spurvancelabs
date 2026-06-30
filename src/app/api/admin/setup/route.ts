import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email || 'admin@gmail.com';
    const password = body.password || 'admin123@';
    const name = body.name || 'Admin';

    const supabase = getSupabaseAdminClient();

    const { data: existing } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.role === 'ADMIN') {
        return NextResponse.json({ message: 'Admin user already exists. Login at /login' });
      }
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'ADMIN' })
        .eq('id', existing.id);
      if (updateError) throw updateError;
      return NextResponse.json({ message: 'Admin role granted. Login at /login' });
    }

    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'ADMIN' },
    });

    if (createError) throw createError;

    return NextResponse.json({ message: 'Admin user created successfully. Login at /login' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

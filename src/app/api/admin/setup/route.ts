import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { ROLES } from '@/lib/lms/roles';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const setupSecret = process.env.ADMIN_SETUP_SECRET;

    if (!setupSecret) {
      return NextResponse.json(
        { error: 'Admin setup is not configured. Set ADMIN_SETUP_SECRET in your environment.' },
        { status: 503 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${setupSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide a valid ADMIN_SETUP_SECRET in the Authorization header.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = body.email;
    const password = body.password;
    const name = body.name || 'Admin';

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    const { data: { users: authUsers }, error: listError } = await supabase.auth.admin.listUsers();
    const existingAuthUser = authUsers?.find(u => u.email === email);

    if (existingAuthUser) {
      const { data: existingAdmin } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', existingAuthUser.id)
        .single();

      if (existingAdmin) {
        return NextResponse.json({ message: 'Admin user already exists. Login at /admin/login' });
      }

      const now = new Date().toISOString();
      await supabase.from('admin_users').insert({
        user_id: existingAuthUser.id,
        role: ROLES.SUPER_ADMIN,
        created_at: now,
        updated_at: now,
      });

      return NextResponse.json({ message: 'Super Admin role granted. Login at /admin/login' });
    }

    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, skip_users_table: true },
    });

    if (createError) throw createError;

    if (authUser?.user) {
      const now = new Date().toISOString();
      await supabase.from('admin_users').insert({
        user_id: authUser.user.id,
        role: ROLES.SUPER_ADMIN,
        created_by: authUser.user.id,
        created_at: now,
        updated_at: now,
      });
    }

    return NextResponse.json({ message: 'Super Admin user created successfully. Login at /admin/login' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}

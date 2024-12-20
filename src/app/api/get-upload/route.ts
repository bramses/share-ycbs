import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME_UPLOAD!).select('*').eq('id', id).single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

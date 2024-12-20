import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const entryid = searchParams.get('entryid');
  if (!entryid) return NextResponse.json({ error: 'entryid required' }, { status: 400 });

  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!).select('*').eq('entry_id', entryid).single();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

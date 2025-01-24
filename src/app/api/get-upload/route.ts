import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const entryID = searchParams.get('entry_id');
  if (!id && !entryID) return NextResponse.json({ error: 'id or entry_id required' }, { status: 400 });

  if(id) {
    const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME_UPLOAD!).select('*').eq('id', id).single();

    if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
  } else {
    const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME_UPLOAD!).select('*').eq('entry_id', entryID).single();

    if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
  }
  
}

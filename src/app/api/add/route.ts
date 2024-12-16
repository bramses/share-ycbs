import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { replaceImages } from '@/utils/replaceImages';

export async function POST(req: Request) {
  const body = await req.json();
  // expects { userid, entryid, json }
  const { userid, entryid, json } = body;
  if (!userid || !entryid || !json) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  
  const replaced = await replaceImages(json);
  const { data, error } = await supabase.from('your_table_name').insert({ userid, entryid, json: replaced }).select();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}
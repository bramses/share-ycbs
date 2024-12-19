import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { replaceImages } from '@/utils/replaceImages';

export async function POST(req: Request) {
  const body = await req.json();
  // expects { userid, entryid, json }
  const { userid, entryid, json, username } = body;
  if (!userid || !entryid || !json || !username) return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
  
  const replaced = await replaceImages(json);
  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!).insert([
    {
      userid,
      entryid,
      json: replaced,
      username,
    },
  ]);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const username = url.searchParams.get('username')?.toLowerCase(); // Extract the username from the query parameters
    if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 });

  const { data, error } = await supabase
    .from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!)
    .select('*')
    .eq('creator', username); // Query by username
  if (error) return NextResponse.json({ error }, { status: 500 });

  console.log(data);
  return NextResponse.json({ data });
}
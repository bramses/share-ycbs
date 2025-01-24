import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const entryid = searchParams.get('entryid');
  if (!entryid) return new Response(JSON.stringify({ error: 'entryid required' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' } });

  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!).select('*').eq('entry_id', entryid).single();
  if (error) return new Response(JSON.stringify({ error }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' } });
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:3000' } });
}

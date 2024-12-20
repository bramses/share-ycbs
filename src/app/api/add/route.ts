import { supabase } from '@/lib/supabase';
import { replaceImages } from '@/utils/replaceImages';

export async function POST(req: Request) {
  const body = await req.json();
  // expects {  entryid, json }
  const {  entryid, json, username } = body;
  if (!entryid || !json || !username) {
    return new Response(JSON.stringify({ error: 'missing required fields' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000', // Allow requests from this origin
        'Content-Type': 'application/json',
      },
    });
  }
  
  const replaced = await replaceImages(json);
  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!).insert([
    {
      "entry_id": entryid,
      json: { "data": replaced, "type": "graph" },
      username,
    },
  ]);
  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000', // Allow requests from this origin
        'Content-Type': 'application/json',
      },
    });
  }
  return new Response(JSON.stringify({ data }), {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000', // Allow requests from this origin
      'Content-Type': 'application/json',
    },
  });
}
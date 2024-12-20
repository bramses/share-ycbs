import { supabase } from '@/lib/supabase';

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
  
  // const replaced = await replaceImages(json);
  const { data, error } = await supabase.from(process.env.NEXT_PUBLIC_SUPABASE_TABLE_NAME!).upsert([
    {
      "entry_id": entryid,
      json: { "data": json, "type": "graph" },
      username,
    },
  ], {
    onConflict: 'entry_id', // Concatenate column names into a single string
  });
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
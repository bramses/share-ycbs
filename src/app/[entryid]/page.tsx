// app/[entryid]/page.tsx

import ForceDirectedGraph from '@/components/ForceDirectedGraph';

async function getData(entryid: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/get?entryid=${entryid}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('failed to fetch data');
  }
  const { data } = await res.json();
  return data;
}

export default async function Page({ params }: { params: { entryid: string } }) {
  const data = await getData(params.entryid);

  // data.json is what you stored in supabase
  return (
    <div>
      <h1>Graph for {params.entryid}</h1>
      <ForceDirectedGraph data={data.json.data}/>
    </div>
  );
}

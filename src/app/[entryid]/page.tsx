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

type Params = {
    entryid: string;
  };
  
  type PageProps = {
    params: Promise<Params>;
  };

export default async function Page({ params }: PageProps) {
    const resolvedParams = await params;
  const data = await getData(resolvedParams.entryid);

  // data.json is what you stored in supabase
  return (
    <div>
      <h1>Graph for {resolvedParams.entryid}</h1>
      <ForceDirectedGraph data={data.json.data}/>
    </div>
  );
}

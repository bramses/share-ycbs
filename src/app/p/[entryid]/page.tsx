// app/[entryid]/page.tsx

import ForceDirectedGraph from "@/components/ForceDirectedGraph";
import Link from "next/link";

async function getData(entryid: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get?entryid=${entryid}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data"); // todo: should 404 here
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
      <h1>
        <Link href={`/${data.user_id}`} className="underline" prefetch={false}>
          See all of {data.user_id}&apos;s entries
        </Link>
      </h1>
      <h1>Make your own knowledge graph</h1>
      <ForceDirectedGraph data={data.json.data} />
    </div>
  );
}

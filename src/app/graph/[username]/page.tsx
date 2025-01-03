// app/[username]/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";

async function getData(username: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-user?username=${username}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  const { data } = await res.json();
  return data;
}

type Params = {
  username: string;
};

type PageProps = {
  params: Promise<Params>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.username);

  // data.json is what you stored in supabase
  return (
    <div>
      <h1>All entries for {resolvedParams.username}</h1>
      {data.map((entry: any) => (
        <div key={entry.entry_id}>
          <h2>
            <Link href={`/p/${entry.entry_id}`} className="underline" prefetch={false}>
              {entry.json.data.entry}
            </Link>
          </h2>
        </div>
      ))}
    </div>
  );
}

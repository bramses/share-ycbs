/* eslint-disable @typescript-eslint/no-explicit-any */

// app/u/[id]/page.tsx
import CopyButton from "@/components/CopyButton";
import Link from "next/link";

async function getData(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-upload?id=${id}`,
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
  id: string;
};

type PageProps = {
  params: Promise<Params>;
};

function makeLinksClickable(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.id);

  return (
    <div className="flex flex-col gap-2 m-4">
      <CopyButton id={resolvedParams.id} />
      <Link href={`/${data.json.username}`} className="underline" prefetch={false}>
      See all of {data.json.username}&apos;s entries
      </Link>
      <div className="block max-w-100 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
        <p className="font-normal text-gray-700">
          {data.json.entry.data}
        </p>
        <span className="block text-sm text-gray-500">{makeLinksClickable(JSON.stringify((data.json.entry.metadata), null, 2))}</span>
      </div>
      {data.json.comments?.map((comment: any, i: number) => (
        <div
          key={i}
          className="block max-w-100 ml-4 p-6 bg-white border border-yellow-500 rounded-lg shadow hover:bg-gray-100 mt-4"
        >
          <p className="font-normal text-gray-700">
            {comment.data}
          </p>
          <span className="block text-sm text-gray-500">{makeLinksClickable(JSON.stringify(comment.metadata, null, 2))}</span>
        </div>
      ))}
    </div>
  );
}

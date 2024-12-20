// app/u/[id]/page.tsx
import CopyButton from "@/components/CopyButton";

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

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.id);

  // data.json is what you stored in supabase
  /* {
  "data": "Kingdom Hearts 2 - The time Sora sliced through several buildings - YouTube",
  "metadata": "{\"title\":\"Kingdom Hearts 2 - The time Sora sliced through several buildings - YouTube\",\"author\":\"https://www.youtube.com/watch?v=gIu8qZnAcy8\",\"alias_ids\":[\"6668\"],\"links\":[{\"name\":\"sora vs xemnas\",\"url\":\"https://www.youtube.com/watch?v=npT9BbknuSA\"},{\"name\":\"the building jump part\",\"url\":\"https://youtu.be/_vocDalCY8c?si=IeueWAaTiKDzZmUa&t=130\"},{\"name\":\"vox machina tuns on building\",\"url\":\"https://youtu.be/Pa4FbDg_qnA?si=0XteEayMj_b_axJr&t=221\"}]}",
  "createdAt": "2024-09-16T02:27:54.725Z",
  "updatedAt": "2024-09-16T06:46:43.657Z"
} */
  return (
    <div>
      <p>{JSON.stringify(data.json.data)}</p>
      <p>{JSON.stringify(JSON.parse(data.json.metadata), null, 2)}</p>
      <CopyButton id={resolvedParams.id} />
    </div>
  );
}

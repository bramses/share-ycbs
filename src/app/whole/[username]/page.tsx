/* app/u/[username]/page.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";

type APIItem = {
  id: number;
  created_at: string;
  updated_at: string;
  json: {
    entry: {
      data: string;
      metadata: any;
      image?: string;
    };
    comments?: {
      data: string;
      metadata: any;
      image?: string;
    }[];
    username: string;
  };
  creator: string;
};

export default function Page({ params }: { params: Promise<{ username: string }> }) {

  const [resolvedParams, setResolvedParams] = useState<{ username: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);


  const [items, setItems] = useState<APIItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // for the check/uncheck all
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [copiedValue, setCopiedValue] = useState("");

  console.log(params);

  // fetch the array from your API
  useEffect(() => {
    const doFetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/get-user?username=${resolvedParams!.username}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("failed to fetch user data");
        }
        const data = await res.json(); // this is an array
        // sort by created_at desc
        data.data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(data.data);
      } catch (err: any) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [resolvedParams]);

  if (error) return <div className="m-4">error: {error}</div>;
  if (loading) return <div className="m-4">loading...</div>;

  // “check/uncheck all”
  const allSelected = selectedIds.length === items.length && items.length > 0;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  }

  function toggleOne(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function copySelected() {
    // base64 of the list of IDs
    const arrStr = JSON.stringify({ ids: selectedIds, from: resolvedParams!.username });
    const encoded = btoa(arrStr);
    await navigator.clipboard.writeText(encoded);
    setCopiedValue(encoded);
  }

  return (
    <div className="m-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold mb-2">{resolvedParams!.username}&apos;s entries</h1>
      <div className="flex gap-4">
        <button onClick={toggleAll} className="border px-2 py-1 rounded">
          {allSelected ? "uncheck all" : "check all"}
        </button>
        <button
          onClick={copySelected}
          className="border px-2 py-1 rounded"
          disabled={!selectedIds.length}
        >
          copy id
        </button>
      </div>

      {copiedValue && (
        <div className="text-sm text-gray-600">
          base64 of selected ids: {copiedValue}
        </div>
      )}

      {/* map over each item returned by the API */}
      <div className="flex flex-col gap-6 mt-4">
        {items.map((item) => (
          <Card
            key={item.id}
            item={item}
            isSelected={selectedIds.includes(item.id)}
            onToggle={() => toggleOne(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// a separate “Card” component to show the main entry + any comments
function Card({
  item,
  isSelected,
  onToggle,
}: {
  item: APIItem;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const { entry, comments } = item.json;

  return (
    <div className="border p-4 rounded shadow flex gap-2 items-start">
      <input type="checkbox" checked={isSelected} onChange={onToggle} />
      <div>
        {/* main entry */}
        <p className="mb-2 font-semibold">{entry.data}</p>
        {entry.image && (
          <img
            src={entry.image}
            alt="entry img"
            className="max-w-xs mb-2 border"
          />
        )}
        <MetadataDisplay metadata={entry.metadata} />
        <div className="mt-2 text-sm text-blue-600 underline">
          {new Date(item.created_at).toLocaleString()}
        </div>

        {/* comments if any */}
        {comments && comments.length > 0 && (
          <div className="mt-3">
            {comments.map((c, i) => (
              <div key={i} className="border-l pl-3 mb-2">
                <p>{c.data}</p>
                {c.image && (
                  <img
                    src={c.image}
                    alt={`comment ${i}`}
                    className="max-w-xs mb-2 border"
                  />
                )}
                <MetadataDisplay metadata={c.metadata} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// optional helper to show metadata with clickable links
function MetadataDisplay({ metadata }: { metadata: any }) {
  if (!metadata) return null;
  const asString = JSON.stringify(metadata, null, 2);

  // naive link detection
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = asString.split(urlRegex);

  return (
    <pre className="text-sm text-gray-500 whitespace-pre-wrap">
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </pre>
  );
}

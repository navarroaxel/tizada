import type { Metadata } from "next";
import { Suspense } from "react";
import { ResourceFilter } from "@/components/ResourceFilter";
import { resources } from "@/content/resources";
import { pages } from "@/content/site";
import { getResourceLevels } from "@/lib/content";

export const metadata: Metadata = { title: pages.resources.title, description: pages.resources.lead };

export default function ResourcesPage() {
  const items = resources.map((r) => ({ ...r, levels: getResourceLevels(r.id) }));
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{pages.resources.title}</h1>
      <p className="prose-measure mt-3">{pages.resources.lead}</p>
      <div className="mt-6">
        <Suspense fallback={null}>
          <ResourceFilter items={items} />
        </Suspense>
      </div>
    </div>
  );
}

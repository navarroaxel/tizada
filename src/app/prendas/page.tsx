import type { Metadata } from "next";
import { garments } from "@/content/garments";
import { pages } from "@/content/site";

export const metadata: Metadata = { title: pages.garments.title, description: pages.garments.lead };

export default function GarmentsPage() {
  const t = pages.garments;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{t.title}</h1>
      <p className="prose-measure mt-3">{t.lead}</p>
      <div className="table-scroll mt-6">
        <table>
          <thead>
            <tr>{t.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {garments.map((g) => (
              <tr key={g.name}>
                <th scope="row">{g.name}</th>
                <td>{g.level}</td>
                <td>{g.base}</td>
                <td>{g.adds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

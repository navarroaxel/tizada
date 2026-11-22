import type { Metadata } from "next";
import { pages } from "@/content/site";
import { physicalMaterials, setupChecklist, tools } from "@/content/tools";

export const metadata: Metadata = { title: pages.tools.title, description: pages.tools.lead };

export default function ToolsPage() {
  const t = pages.tools;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl">{t.title}</h1>
      <p className="prose-measure mt-3">{t.lead}</p>

      <h2 className="mt-10 text-2xl">{t.software}</h2>
      <div className="table-scroll mt-3">
        <table>
          <thead>
            <tr>{t.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {tools.map((x) => (
              <tr key={x.name}>
                <th scope="row">{x.name}</th>
                <td>{x.use}</td>
                <td>{x.level}</td>
                <td>{x.free}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-2xl">{t.materials}</h2>
      <ul className="prose-measure mt-3 list-disc pl-5">
        {physicalMaterials.map((m) => <li key={m}>{m}</li>)}
      </ul>

      <h2 className="mt-10 text-2xl">{t.checklist}</h2>
      <ul className="prose-measure mt-3 list-disc pl-5">
        {setupChecklist.map((m) => <li key={m}>{m}</li>)}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { copy } from "@/content/site";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl">{copy.notFoundTitle}</h1>
      <p className="mt-3">{copy.notFoundText}</p>
      <p className="mt-6"><Link href="/" className="btn btn-primary">{copy.notFoundCta}</Link></p>
    </div>
  );
}

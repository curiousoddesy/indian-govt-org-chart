import { Link } from "react-router-dom";
import { getAllWikiPages } from "../lib/wiki";

export default function WikiIndex() {
  const pages = getAllWikiPages();

  return (
    <div className="page-enter space-y-8">
      <div>
        <p className="eyebrow mb-2">Connected notes</p>
        <h1 className="display text-3xl sm:text-4xl">Documentation Wiki</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          A connected knowledge base about government accountability data in India.
          Pages link to each other — follow the trail to build intuition, like
          wandering through a well-organized notebook.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            to={page.slug ? `/docs/${page.slug}` : "/docs"}
            className="group border border-[var(--rule)] bg-white/75 p-5 transition hover:border-saffron-400 hover:bg-white"
          >
            <h2 className="font-display text-lg font-semibold text-ink-950 group-hover:text-saffron-700">
              {page.title.replace(/^#+\s*/, "")}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-ink-500">
              {page.description}
            </p>
            {page.links.length > 0 && (
              <p className="mt-3 text-xs uppercase tracking-[0.08em] text-ink-400">
                Links to {page.links.length} related page
                {page.links.length !== 1 ? "s" : ""}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

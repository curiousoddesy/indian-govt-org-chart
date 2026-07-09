import { Link, useParams } from "react-router-dom";
import {
  getWikiPage,
  getAllWikiPages,
  getBacklinks,
  renderWikiMarkdown,
} from "../lib/wiki";

function wikiPath(slug: string) {
  return slug ? `/docs/${slug}` : "/docs";
}

export default function WikiPage() {
  const { slug = "" } = useParams();
  const page = getWikiPage(slug);
  const allPages = getAllWikiPages();
  const backlinks = page ? getBacklinks(page.slug) : [];

  if (!page) {
    return (
      <div className="panel p-8 text-center">
        <h1 className="display mb-2 text-2xl">Page not found</h1>
        <Link to="/docs" className="text-saffron-600 hover:underline">
          ← Back to wiki index
        </Link>
      </div>
    );
  }

  const html = renderWikiMarkdown(page.content);

  return (
    <div className="page-enter grid gap-8 lg:grid-cols-4">
      <aside className="space-y-4 lg:col-span-1">
        <div className="panel sticky top-24 p-4">
          <h3 className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
            Wiki Pages
          </h3>
          <nav className="space-y-1">
            {allPages.map((p) => (
              <Link
                key={p.slug || "index"}
                to={wikiPath(p.slug)}
                className={`block px-2 py-1.5 text-sm transition ${
                  p.slug === page.slug
                    ? "bg-ink-950 text-white"
                    : "text-ink-600 hover:bg-ink-100"
                }`}
              >
                {p.title.replace(/^#+\s*/, "")}
              </Link>
            ))}
          </nav>

          {backlinks.length > 0 && (
            <div className="mt-6 border-t border-[var(--rule)] pt-4">
              <h4 className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-400">
                Backlinks
              </h4>
              <div className="space-y-1">
                {backlinks.map((bl) => (
                  <Link
                    key={bl.slug || "index"}
                    to={wikiPath(bl.slug)}
                    className="block text-sm text-saffron-600 hover:underline"
                  >
                    {bl.title.replace(/^#+\s*/, "")}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <article className="lg:col-span-3">
        <div className="panel p-6 sm:p-8">
          <div
            className="wiki-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {page.links.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
              Related pages
            </h3>
            <div className="flex flex-wrap gap-2">
              {page.links.map((link) => (
                <Link
                  key={link}
                  to={wikiPath(link)}
                  className="border border-[var(--rule)] bg-white/80 px-3 py-1 text-sm text-ink-700 transition hover:border-saffron-400 hover:text-saffron-700"
                >
                  {link.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

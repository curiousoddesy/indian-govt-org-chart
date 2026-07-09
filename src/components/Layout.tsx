import { NavLink, Outlet, useLocation } from "react-router-dom";

const nav = [
  { to: "/", label: "Home" },
  { to: "/ask", label: "Ask" },
  { to: "/explore", label: "Explore" },
  { to: "/geography", label: "Geography" },
  { to: "/quality", label: "Quality" },
  { to: "/docs", label: "Wiki" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--rule)] bg-[color-mix(in_oklch,var(--paper)_88%,white)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <NavLink to="/" className="group flex min-w-0 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink-950 bg-ink-950 font-display text-sm font-bold tracking-tight text-[oklch(0.86_0.12_75)] transition group-hover:bg-ink-800"
              aria-hidden
            >
              IG
            </div>
            <div className="min-w-0">
              <div className="font-display text-[1.15rem] font-bold leading-none tracking-tight text-ink-950 transition group-hover:text-saffron-600 sm:text-xl">
                Indian Govt Org Chart
              </div>
              <div className="mt-1 hidden text-[0.7rem] uppercase tracking-[0.12em] text-ink-500 sm:block">
                Public accountability register
              </div>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/" || item.to === "/docs"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-ink-950 text-white"
                      : "text-ink-600 hover:bg-ink-100/80 hover:text-ink-950"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <nav
          className="flex gap-1 overflow-x-auto px-4 pb-2.5 scrollbar-hide md:hidden"
          aria-label="Primary mobile"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/" || item.to === "/docs"}
              className={({ isActive }) =>
                `shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  isActive
                    ? "bg-ink-950 text-white"
                    : "border border-[var(--rule)] bg-white/70 text-ink-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 sm:py-10">
        <Outlet key={location.pathname} />
      </main>

      <footer className="mt-auto border-t border-[var(--rule)] bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:px-6">
          <p>
            Data: ODC-By · Code: MIT · Official contacts only
          </p>
          <a
            href="https://github.com/curiousoddesy/indian-govt-org-chart"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink-700 underline decoration-[var(--rule)] underline-offset-4 transition hover:text-saffron-600 hover:decoration-saffron-400"
          >
            Open source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

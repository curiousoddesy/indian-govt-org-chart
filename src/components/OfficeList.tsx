import type { OfficeHolder } from "../lib/types";

export function HolderName({
  person,
  vacant,
}: {
  person: string | null | undefined;
  vacant?: boolean;
}) {
  if (vacant || !person) {
    return <span className="text-amber-700 font-medium">Vacant</span>;
  }
  return <span className="font-medium text-ink-900">{person}</span>;
}

export function OfficeRow({ office }: { office: OfficeHolder }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-ink-500 truncate">{office.title}</p>
        <p className="truncate">
          <HolderName person={office.person_name} vacant={office.is_vacant} />
          {office.person_party ? (
            <span className="text-xs text-ink-400 ml-2">{office.person_party}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

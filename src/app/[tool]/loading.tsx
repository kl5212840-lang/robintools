export default function ToolPageLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-10 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-4 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-24 rounded bg-[var(--color-surface-overlay)]" />
      </div>

      {/* Header skeleton */}
      <div className="mb-12 flex items-start gap-5">
        <div className="h-16 w-16 shrink-0 rounded-2xl bg-[var(--color-surface-overlay)]" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 rounded-lg bg-[var(--color-surface-overlay)]" />
          <div className="h-5 w-full max-w-xl rounded bg-[var(--color-surface-overlay)]" />
          <div className="flex gap-5">
            <div className="h-5 w-28 rounded bg-[var(--color-surface-overlay)]" />
            <div className="h-5 w-36 rounded bg-[var(--color-surface-overlay)]" />
            <div className="h-5 w-44 rounded bg-[var(--color-surface-overlay)]" />
          </div>
        </div>
      </div>

      {/* Tab bar skeleton — generic placeholder, adapts to any tab count */}
      <div className="mb-10 h-[59px] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-1.5">
        <div className="h-full w-full rounded-lg bg-[var(--color-surface-overlay)]" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block space-y-2 rounded-2xl border border-[var(--color-border-subtle)] p-4">
          <div className="h-5 w-16 rounded bg-[var(--color-surface-overlay)]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-overlay)]" />
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-[var(--color-border-subtle)] p-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-48 rounded bg-[var(--color-surface-overlay)]" />
              <div className="h-4 w-full rounded bg-[var(--color-surface-overlay)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--color-surface-overlay)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

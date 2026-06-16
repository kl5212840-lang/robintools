export default function GuidePageLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 w-10 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-4 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-20 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-4 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-4 w-16 rounded bg-[var(--color-surface-overlay)]" />
      </div>

      {/* Header skeleton */}
      <div className="mb-10 space-y-3">
        <div className="h-4 w-28 rounded bg-[var(--color-surface-overlay)]" />
        <div className="h-8 w-72 rounded-lg bg-[var(--color-surface-overlay)]" />
        <div className="h-5 w-96 rounded bg-[var(--color-surface-overlay)]" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block space-y-2 rounded-2xl border border-[var(--color-border-subtle)] p-4">
          <div className="h-5 w-16 rounded bg-[var(--color-surface-overlay)]" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-[var(--color-surface-overlay)]" />
          ))}
        </div>
        {/* Main content skeleton */}
        <div>
          <div className="mb-6 flex justify-center">
            <div className="h-[59px] w-[420px] rounded-xl bg-[var(--color-surface-overlay)]" />
          </div>
          <div className="space-y-4 rounded-2xl border border-[var(--color-border-subtle)] p-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-40 rounded bg-[var(--color-surface-overlay)]" />
                <div className="h-4 w-full rounded bg-[var(--color-surface-overlay)]" />
                <div className="h-4 w-2/3 rounded bg-[var(--color-surface-overlay)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

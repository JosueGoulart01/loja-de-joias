export default function ConfiguracoesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-12 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-6 w-96 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card Skeleton 1 */}
          <div className="space-y-6 rounded-xl border-2 p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-muted" />
                <div className="h-4 w-56 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Card Skeleton 2 */}
          <div className="space-y-6 rounded-xl border-2 p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="flex h-24 items-center justify-between rounded-xl border-2 px-6">
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}

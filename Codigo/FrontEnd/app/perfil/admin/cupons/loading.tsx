export default function Loading() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="flex gap-4 mb-8">
        <div className="h-12 flex-1 bg-muted animate-pulse rounded" />
        <div className="h-12 flex-1 bg-muted animate-pulse rounded" />
      </div>
      <div className="h-96 bg-muted animate-pulse rounded" />
    </div>
  )
}
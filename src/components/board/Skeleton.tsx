export default function CardSkeleton() {
  return (
    <div className="bg-white border-2 border-dark/20 p-3 animate-pulse">
      <div className="h-4 bg-dark/10 rounded mb-2 w-3/4" />
      <div className="h-3 bg-dark/10 rounded mb-3 w-1/2" />
      <div className="flex gap-1.5">
        <div className="h-5 w-16 bg-dark/10 rounded" />
        <div className="h-5 w-12 bg-dark/10 rounded" />
      </div>
    </div>
  )
}

export function ColumnSkeleton() {
  return (
    <div className="flex flex-col min-w-[260px] w-[260px]">
      <div className="h-10 bg-dark/10 border-2 border-dark/20 mb-2 animate-pulse" />
      <div className="flex flex-col gap-2 p-2 border-2 border-dashed border-dark/20 min-h-[120px]">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

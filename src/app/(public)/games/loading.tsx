import { Skeleton } from "@/components/ui/skeleton";

export default function GamesListLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="flex flex-col gap-3 mb-8">
        <Skeleton variant="text" className="w-64 h-8" />
        <Skeleton variant="text" className="w-96" />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border-color bg-bg-secondary overflow-hidden flex flex-col">
            <Skeleton className="aspect-[4/3]" />
            <div className="p-4 flex flex-col gap-2">
              <Skeleton variant="text" className="w-3/4 h-5" />
              <Skeleton variant="text" className="w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton variant="text" className="w-24" />
                <Skeleton className="w-16 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

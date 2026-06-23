import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 flex flex-col gap-8">
      {/* Back Link */}
      <Skeleton variant="text" className="w-40" />

      {/* Status Hero */}
      <div className="rounded-2xl border border-border-color bg-bg-secondary p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <Skeleton variant="circle" className="w-16 h-16" />
          <Skeleton className="w-32 h-6 rounded-full mt-4" />
          <Skeleton variant="text" className="w-64 h-7 mt-4" />
          <Skeleton variant="text" className="mt-3 max-w-md" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto">
            <Skeleton className="w-full sm:w-48 h-11 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="rounded-2xl border border-border-color bg-bg-secondary p-6 sm:p-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <Skeleton variant="text" className="w-48 h-6" />
          <Skeleton className="w-28 h-8 rounded-lg" />
        </div>

        {/* Game Info */}
        <div className="flex items-center gap-4 border-b border-border-color pb-5">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="w-40 h-5" />
            <Skeleton variant="text" className="w-32" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton variant="text" className="w-24" />
              <Skeleton variant="text" className="w-40 h-5" />
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-border-color pt-6 mt-6 flex flex-col gap-3.5">
          <Skeleton variant="text" className="w-32" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2.5">
              <Skeleton variant="circle" className="w-4 h-4" />
              <Skeleton variant="text" className="w-48" />
            </div>
            <div className="flex items-center gap-2.5">
              <Skeleton variant="circle" className="w-4 h-4" />
              <Skeleton variant="text" className="w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function GameDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Game Info Card */}
        <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="rounded-2xl p-6 border border-border-color bg-bg-secondary flex flex-col items-center text-center">
            <Skeleton className="w-32 h-32 rounded-2xl" />
            <Skeleton variant="text" className="w-24 mt-4" />
            <Skeleton variant="text" className="w-32 h-6 mt-2" />
            <Skeleton className="w-20 h-6 rounded-full mt-3" />

            <div className="border-t border-border-color pt-5 w-full text-left mt-5">
              <Skeleton variant="text" className="w-40 h-5" />
              <Skeleton variant="text" className="mt-3" />
              <Skeleton variant="text" className="mt-1.5" />
              <Skeleton variant="text" className="mt-1.5 w-3/4" />
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Account Info */}
          <div className="rounded-2xl border border-border-color bg-bg-secondary p-6">
            <Skeleton variant="text" className="w-48 h-5 mb-4" />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton variant="text" className="w-32" />
                <Skeleton className="w-full h-11" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton variant="text" className="w-32" />
                <Skeleton className="w-full h-11" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="rounded-2xl border border-border-color bg-bg-secondary p-6">
            <Skeleton variant="text" className="w-48 h-5 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-2xl border border-border-color bg-bg-secondary p-6">
            <Skeleton variant="text" className="w-48 h-5 mb-4" />
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton className="w-full h-11" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" className="w-32" />
                  <Skeleton className="w-full h-11" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton variant="text" className="w-32" />
                <Skeleton className="w-full h-11" />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full bg-bg-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            <div className="space-y-6 lg:max-w-xl">
              <Skeleton variant="text" className="w-96 h-12" />
              <Skeleton variant="text" className="w-80 h-12" />
              <Skeleton variant="text" className="w-full max-w-md h-5 mt-2" />

              {/* Search Widget */}
              <Skeleton className="w-full max-w-lg h-14 rounded-xl" />

              {/* Trust signals */}
              <div className="flex items-center gap-5 pt-2">
                <Skeleton variant="text" className="w-32" />
                <Skeleton variant="text" className="w-32" />
                <Skeleton variant="text" className="w-32" />
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative w-full max-w-md mx-auto">
              <Skeleton className="aspect-square rounded-[28px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-10 sm:py-14 bg-bg-secondary border-y border-border-color">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

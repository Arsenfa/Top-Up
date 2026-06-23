import { Skeleton } from "@/components/ui/skeleton";

export default function CekOrderLoading() {
  return (
    <div className="flex-grow flex items-center justify-center py-16 sm:py-24 px-4">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Title */}
        <div className="text-center flex flex-col gap-2">
          <Skeleton variant="text" className="w-48 h-7 mx-auto" />
          <Skeleton variant="text" className="w-64 mx-auto" />
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border-color bg-bg-secondary p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" className="w-32" />
            <Skeleton className="w-full h-11 rounded-xl" />
          </div>
          <Skeleton className="w-full h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

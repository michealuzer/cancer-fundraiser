export default function PatientGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {/* Image placeholder */}
          <div className="h-48 w-full animate-pulse bg-gray-100" />

          <div className="flex flex-col gap-3 p-5">
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-28 animate-pulse rounded-md bg-gray-100" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>

            {/* Story lines */}
            <div className="space-y-2">
              <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-100" />
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full animate-pulse rounded-full bg-gray-100" />
              <div className="flex justify-between">
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              </div>
            </div>

            {/* Button */}
            <div className="h-9 w-full animate-pulse rounded-md bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

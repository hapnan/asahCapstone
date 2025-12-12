import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Section Cards Skeleton */}
          <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="@container/card">
                <CardHeader>
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-8 w-[80px] mt-2" />
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <Skeleton className="h-5 w-[200px]" />
                  <Skeleton className="h-4 w-[250px] mt-2" />
                </div>
                <div className="flex">
                  <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-7 w-[100px] mt-1" />
                  </div>
                  <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-7 w-[100px] mt-1" />
                  </div>
                </div>
              </CardHeader>
              <div className="px-2 pt-4 sm:px-6 sm:pt-6">
                <Skeleton className="h-[250px] w-full" />
              </div>
            </Card>
          </div>

          {/* Data Table Skeleton */}
          <div className="px-4 lg:px-6">
            <Card>
              <div className="p-6 space-y-4">
                {/* Tabs Skeleton */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-[100px]" />
                  ))}
                </div>

                {/* Search and Filter Skeleton */}
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-10 w-[300px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[100px]" />
                  </div>
                </div>

                {/* Table Headers Skeleton */}
                <div className="border rounded-md">
                  <div className="border-b bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-[80px]" />
                      <Skeleton className="h-4 w-[120px] ml-auto" />
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>

                  {/* Table Rows Skeleton */}
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="border-b last:border-b-0 p-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-4 w-[120px] ml-auto" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[200px]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

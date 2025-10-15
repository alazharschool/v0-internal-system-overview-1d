import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-full md:w-[180px]" />
      </div>

      <Skeleton className="h-10 w-full md:w-[300px] mb-4" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((group) => (
            <div key={group}>
              <Skeleton className="h-4 w-[120px] mb-3" />
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-[70%]" />
                        <Skeleton className="h-4 w-[20%]" />
                      </div>
                      <Skeleton className="h-3 w-[200px]" />
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-[80px]" />
                        <Skeleton className="h-7 w-[100px]" />
                        <Skeleton className="h-7 w-[30px]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

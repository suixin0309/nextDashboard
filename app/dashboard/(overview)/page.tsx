import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import StatisticsChart from '@/app/ui/dashboard/statistics-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
export default async function Page() {
  return (
    <main>
      {/* <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1> */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          <Suspense fallback={<CardsSkeleton />}>
            <CardWrapper></CardWrapper>
          </Suspense>
        </div>
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <StatisticsChart />
        </Suspense>
        </div>
        
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
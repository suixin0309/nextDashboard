import Pagination from '@/app/ui/inventory/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/inventory/inRecord/table';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages1 } from '@/app/lib/data';
 
export default async function Page({
    searchParams,
}:{
    searchParams: {
        query?: string;
        page?: string;
    }
}) {
    const query=searchParams?.query||'';
    const currentPage=Number(searchParams?.page)||1;
    const totalPages=await fetchInvoicesPages1(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>入库记录</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="搜索入库记录..." />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
import Pagination from '@/app/ui/orders/pagination';
import Search from '@/app/ui/search';
import { CreateManagement } from '@/app/ui/customers/buttons';
import Table from '@/app/ui/management/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
 
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
    const totalPages=await fetchInvoicesPages(query);
  return (
    <div className="w-full">
      {/* <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>会员管理</h1>
      </div> */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="搜索..." />
        <CreateManagement />
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
import Image from 'next/image';
import { UpdateCustomer, DeleteInvoice } from '@/app/ui/customers/buttons';
import { formatDateToLocal, formatCurrency,billTypeToName } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';

export default async function OrdersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  会员名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  联系方式
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  消费类型
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  项目名称
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  金额/次数
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  消费时间
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  记录人
                </th>
                {/* <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="">操作</span>
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.bill_type?billTypeToName(invoice.bill_type.toString()):'余额充值'}
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.bill_type?invoice.ticket_name:'余额充值'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {invoice.bill_type==?} */}
                    {formatCurrency(invoice.amount)}/{invoice.count?invoice.count:1}次
                  </td>
                  
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.create_time)}
                  </td>
                  <td className="whitespace-nowrap px-3 text-center pr-3">
                    <div className="flex justify-center">
                      {invoice.nickname}
                      {/* <UpdateCustomer id={invoice.id} /> */}
                      {/* <DeleteInvoice id={invoice.id} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

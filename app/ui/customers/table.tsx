import Image from 'next/image';
import { UpdateCustomer, DeleteInvoice } from '@/app/ui/customers/buttons';
import { CustomerRecharge } from '@/app/ui/customers/modal';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredMembers,recharge } from '@/app/lib/data';
import Link from 'next/link';
import { Member } from '@/app/lib/definitions';
export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredMembers(query, currentPage);
  // const goRecharge = (id: string) => {
  // }
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
                  余额
                </th>

                <th scope="col" className="px-3 py-5 font-medium">
                  时间
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  记录人
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  消费操作
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3 text-center">
                  <span className="">操作</span>
                </th>
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
                      {/* <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      /> */}
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {invoice.create_time} */}
                    {formatDateToLocal(invoice.create_time)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    张三
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {formatCurrency(invoice.amount)} */}
                    <Link
                      href={`/dashboard/orders/${invoice.id}/create`}
                      className="text-blue-600 underline hover:text-blue-500 cursor-pointer mb-1"
                    >
                      添加消费
                    </Link>
                    {/* <div
                      className="text-blue-600 underline hover:text-blue-500"
                      onClick={() => rechargeFun(Number(invoice.id),1000)}
                    >充值</div> */}
                    {/* <CustomerRecharge memberAmountRecharge={(amount:number)=>rechargeFun(Number(invoice.id),amount)} customerId={invoice.id} /> */}
                    <CustomerRecharge customerId={invoice.id} />
                    <div
                      className="text-blue-600 cursor-pointer underline hover:text-blue-500"
                    >消费历史</div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-center gap-3">
                      <UpdateCustomer id={invoice.id} />
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

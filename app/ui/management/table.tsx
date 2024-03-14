import Image from 'next/image';
import { UpdateManagement } from '@/app/ui/customers/buttons';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredManagements } from '@/app/lib/data';

export default async function OrdersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredManagements(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  员工名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  联系方式
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  账号
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  创建时间
                </th>
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  {/* 创建人 */}
                  状态
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
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
                      <p>{invoice.nickname}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.login_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.login_name}
                    {/* <InvoiceStatus status={invoice.status} /> */}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.create_time)}
                  </td>
                  <td className="whitespace-nowrap px-3 text-center pr-3">
                    <div className="flex justify-center">
                      {invoice.status==1 ? '启用' : '停用'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 text-center pr-3">
                    <div className='flex items-center gap-2 '>
                      {/* <div
                        className="text-blue-600 cursor-pointer underline hover:text-blue-500"
                      >重置</div> */}
                      {/* <div
                        className="text-blue-600 cursor-pointer underline hover:text-blue-500"
                      >停用</div> */}
                      <UpdateManagement id={invoice.id} />
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

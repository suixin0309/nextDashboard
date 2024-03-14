
import { UpdateProject } from '@/app/ui/customers/modal';
import { UpdateCustomer, DeleteInvoice } from '@/app/ui/customers/buttons';
import { formatCurrency } from '@/app/lib/utils';
import { fetchFilteredProjects } from '@/app/lib/data';
import {updateProjectStatus} from '@/app/lib/actions'
export default async function ProjectsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredProjects(query, currentPage);
  console.log(invoices)
  const changeStatus = (id: number, status: number) => {
    console.log(id, status);
    
    updateProjectStatus(id, Number(status))
  }
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  项目名称
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  标价
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  时间
                </th> */}
                <th scope="col" className="px-3 py-5 font-medium text-center">
                  状态
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
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.ticket_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.price)}

                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {invoice.enabled==1?'启用':'停用'}
                  </td>
                  <td className="whitespace-nowrap px-3 text-center pr-3">
                    <div className="flex justify-center">
                      
                      {/* <span onClick={()=>changeStatus(invoice.id,invoice.enabled)}>
                      {invoice.enabled==1?'停用':'启用'}
                      </span> */}
                      {/* 张三 */}
                      <UpdateProject project={invoice} />
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

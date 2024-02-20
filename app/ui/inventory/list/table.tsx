import Image from 'next/image';
import { UpdateCustomer } from '@/app/ui/customers/buttons';
import { PopoverDelete } from '@/app/ui/button';
import { Popover, PopoverTrigger, PopoverContent, User } from "@nextui-org/react";
import { EditInventory, InRecord, OutRecord } from '@/app/ui/inventory/modal';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";

import Link from 'next/link';
export default async function InventoryListTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage);
  // const goRecharge = (id: string) => {
  // }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCustomer id={invoice.id} />
                    {/* <DeleteInvoice id={invoice.id} /> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  耗材名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  耗材类型
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  库存
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  出/入库
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
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    张三
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {formatCurrency(invoice.amount)} */}
                    {/* <div
                      className="text-blue-600 underline hover:text-blue-500"
                      onClick={() => goRecharge(invoice.id)}
                    >充值</div> */}
                    {/* <span
                      className="text-blue-600 mr-2 cursor-pointer underline hover:text-blue-500"
                    >入库</span> */}
                    <div className=' flex gap-2'>
                      <InRecord inventory={invoice} />
                      <OutRecord inventory={invoice} />
                    </div>
                    {/* <span
                      className="text-blue-600 cursor-pointer underline hover:text-blue-500"
                    >出库</span> */}
                  </td>

                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-center gap-2">
                      <Popover showArrow placement="bottom">
                        <PopoverTrigger>
                          <div className="text-blue-600 cursor-pointer underline hover:text-blue-500">
                            删除
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-1">
                          <Card shadow="none" className="max-w-[200px] border-none bg-transparent">
                            <CardHeader className="justify-between">
                              <div className="flex gap-3">
                                <div className="flex flex-col items-start justify-center">
                                  <h4 className="text-small font-semibold leading-none text-default-600">
                                    提示
                                  </h4>
                                </div>
                              </div>
                            </CardHeader>
                            <CardBody className="px-3 py-0">
                              <p className="text-small pl-px text-default-500">
                                确定删除该条信息吗？
                              </p>
                            </CardBody>
                            <CardFooter className="flex text-center align-center items-center">
                              <div className="text-center align-middle my-0 mx-auto">
                                <Button
                                  color="primary"
                                  size="sm"
                                >
                                  删除
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
                        </PopoverContent>
                      </Popover>
                      {/* <PopoverDelete>
                      </PopoverDelete> */}
                      <EditInventory id={invoice.id} />
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

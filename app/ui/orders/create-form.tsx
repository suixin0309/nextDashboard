'use client';

import { Ticket, Member, ProjectForm, ConsumptionMenu } from '@/app/lib/definitions';
import { billTypeToName, formatCurrency } from '@/app/lib/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  CurrencyYenIcon,
  UserCircleIcon,
  PhoneIcon,
  BookmarkSquareIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
// import { useFormState } from 'react-dom';
import { useState, useCallback ,useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react"
export default function EditInvoiceForm({
  customer,
  projects,
}: {
  customer: Member;
  projects: Ticket[];
}) {
  const {data} =useSession();
  const [user, setUser] = useState(data?.user)
  const [redirectUrl, setRedirectUrl] = useState(null);
  const router = useRouter();
  const initialState = { message: null, error: {} }
  // const updateInvoiceWithId = updateInvoice.bind(null, customer.id);
  // const [state, dispatch] = useFormState(updateInvoiceWithId, initialState);
  const initProjects: Array<ProjectForm> = [{
    id: 1,
    ticket_id: projects[0].id,
    amount: 0,
    consumptionNumber: 1,
    consumptionType: ConsumptionMenu[0].id,
  }]
  const [projectList, setProjectLst] = useState(initProjects)
  //add 项目
  const addProject = () => {
    const project: ProjectForm = {
      id: projectList.length + 1,
      ticket_id: projects[0].id,
      amount: 0,
      consumptionNumber: 1,
      consumptionType: ConsumptionMenu[0].id,
    }
    projectList.push(project)
    setProjectLst([...projectList])
  }
  //delete 项目
  const deleteProject = (id: any) => {
    // Add your delete project logic here
    const newProjects = projectList.filter((project: ProjectForm) => {
      if (project?.id !== id) {
        return project
      }
    })
    setProjectLst([...newProjects])
  }
  const actionFun =async (events: any) => {
    events.preventDefault();
    try {
      let dataa = {
        member_id: Number(customer.id),
        createId: user?.id,
        projectList
      }
      const response = await fetch('/api/submitOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data:dataa }),
      });
      // await response.json();
      const data = await response.json();
      if (data.redirectTo) {
        console.log(data)
        setRedirectUrl(data.redirectTo);
      }
      if (response.ok) {
        router.push('/dashboard/customers');
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data', error);
    }
  }
  // useEffect(() => {
  //   if (redirectUrl) {
  //     router.push(redirectUrl);
  //   }
  // }, [redirectUrl]);
  if (redirectUrl) {
    console.log(12321312)
    // router.push(redirectUrl);
    return null; // 返回 null 避免组件继续渲染
  }

  return (
    <form action={actionFun}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            会员姓名
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={customer.name}
              maxLength={10}
              readOnly
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            联系方式
          </label>
          <div className="relative">
            <input
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={customer.phone}
              maxLength={13}
              type="tel"
              readOnly
            >
            </input>
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            余额
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={customer.amount / 100}
                placeholder="0.00"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                readOnly
              />
              <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 grid grid-cols-1  md:grid-cols-8 lg:grid-cols-5'>
        <div
          className="flex cursor-pointer h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => addProject()}
        >
          {/* <Button>添加项目</Button> */}
          <span className="hidden md:block">添加项目</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </div>
      </div>
      <div className='rounded-md bg-gray-50 pb-2'>
        <div className="p-6 md:p-4 mt-1 flex  grid grid-cols-10 gap-2">
          <div className="flex-initial col-span-2">
            <label htmlFor="customer" className="block text-sm font-medium">
              消费类型
            </label>
          </div>
          <div className="flex-initial col-span-3">
            <label htmlFor="customer" className="block text-sm font-medium">
              项目名称
            </label>
          </div>
          <div className="col-span-2">
            <label htmlFor="customer" className="block text-sm font-medium">
              次数
            </label>
          </div>
          <div className="col-span-2">
            <label htmlFor="customer" className="block text-sm font-medium">
              金额
            </label>
          </div>
          <div className=''>
          </div>
        </div>
        {
          projectList.map(item => {
            // grid grid-cols-3 gap-4
            return <div key={item.id.toString()} className="rounded-md bg-gray-50 pl-4 pr-4 pb-2  items-center grid grid-cols-10 gap-2">
              <div className="col-span-2">
                <div className="">
                  <select
                    id="customer"
                    name="consumptionType"
                    onChange={(e) => item.consumptionType=e.target.value}
                    defaultValue={item.consumptionType}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2  text-sm  placeholder:text-gray-500"
                  >
                    <option value="" disabled>
                      选择消费类型
                    </option>
                    {ConsumptionMenu.map((item: any) => (
                       <option key={item.id} value={item.id}>
                        {item.name}
                      </option> 
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <select
                    id="customer"
                    name="ticket_id"
                    onChange={(e) => item.ticket_id=Number(e.target.value)}
                    defaultValue={item.ticket_id}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  >
                    <option value="" disabled>
                      选择消费项目
                    </option>
                    {projects.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.ticket_name}
                      </option>
                    ))}
                  </select>
                  <BookmarkSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className=" col-span-2">
                <div className="">
                  <input
                    name='consumptionNumber'
                    type='number'
                    min={1}
                    onChange={(e) => item.consumptionNumber=Number(e.target.value)}
                    defaultValue={item.consumptionNumber}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                  >
                  </input>
                </div>
              </div>
              <div className=" col-span-2">
                <div className="relative">
                  <input
                    name='amount'
                    type='number'
                    onChange={(e) => item.amount=Number(e.target.value)}
                    defaultValue={item.amount}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-8 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className='col-span-1'>
                <button onClick={
                  // Attempt to recover by trying to re-render the invoices route
                  () => deleteProject(item.id)
                } >删除</button>
              </div>
            </div>
          })
        }
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button color="primary" onClick={actionFun}>提交</Button>
      </div>
    </form>
  );
}

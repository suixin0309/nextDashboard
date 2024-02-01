'use client';

import { CustomerField, InvoiceForm, ProjectForm } from '@/app/lib/definitions';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  BookmarkSquareIcon,
  UserCircleIcon,
  PhoneIcon,
  CurrencyYenIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateInvoice } from '@/app/lib/actions'
import { useFormState } from 'react-dom';
import { useState } from 'react';

export default function EditInvoiceForm({
  customer,
  customers,
}: {
  customer: InvoiceForm;
  customers: CustomerField[];
}) {
  const initialState = { message: null, error: {} }
  const updateInvoiceWithId = updateInvoice.bind(null, customer.id);
  const [state, dispatch] = useFormState(updateInvoiceWithId, initialState)
  const initProjects: Array<ProjectForm> = [{
    id: 1,
    projectName: '',
    price: 0,
    consumptionNumber: '1',
    consumptionType: 2,
  }]
  const [projects, setProjects] = useState(initProjects)
  //add 项目
  const addProject = () => {
    const project: ProjectForm = {
      id: projects.length + 1,
      projectName: '',
      price: 0,
      consumptionNumber: '1',
      consumptionType: 2,
    }
    projects.push(project)
    setProjects([...projects])
  }
  //delete 项目
  const deleteProject = (id: any) => {
    const newProjects = projects.filter((project: ProjectForm) => {
      if (project?.id !== id) {
        return project
      }
    })
    setProjects([...newProjects])
  }
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            会员姓名
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={customer.customer_id}
              maxLength={10}
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
              defaultValue={customer.customer_id}
              maxLength={13}
              type="tel"
            >
            </input>
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        {/* customer Amount */}
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
                defaultValue={customer.amount}
                placeholder="0.00"
                disabled
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            备注
          </label>
          <div className="">
            <input
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={customer.customer_id}
              maxLength={50}
              type="text"
            >
            </input>
          </div>
        </div>
      </div>
      {!projects.length||<div className='rounded-md bg-gray-50 pb-2'>
        <div className="p-6 md:p-4 mt-1 flex ">
          <div className="grow">
            <label htmlFor="customer" className="block text-sm font-medium">
              项目名称
            </label>
          </div>
          <div className="grow">
            <label htmlFor="customer" className="block text-sm font-medium">
              剩余次数
            </label>
          </div>
          <div className='grow-1'>
          </div>
        </div>
        {
          projects.map(item => {
            return <div key={item.toString()} className="rounded-md bg-gray-50 pl-4 pr-4 pb-2 flex items-center">
              <div className="grow">
                <div className="relative">
                  <select
                    id="customer"
                    name="customerId"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={customer.customer_id}
                    aria-readonly
                    disabled
                  >
                    <option value="" disabled>
                      选择项目
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  <BookmarkSquareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className="grow">
                <div className="">
                  <input
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={Number(item.consumptionNumber)}
                    type='number'
                    disabled

                  >
                  </input>
                </div>
              </div>
            </div>
          })
        }
      </div>}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">保存会员</Button>
      </div>
    </form>
  );
}

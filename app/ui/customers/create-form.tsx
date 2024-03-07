'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import {
  CheckIcon,
  ClockIcon,
  CurrencyYenIcon,
  UserCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createMember } from '@/app/lib/actions'
import { useFormState } from 'react-dom';
export default function CreateMember() {
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createMember, initialState);
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
              name='name'
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
              name='phone'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              maxLength={13}
              type="tel"
            >
            </input>
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
         {/* customer Amount */}
         {/* <div className="mb-4">
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
                placeholder="0.00"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                readOnly
              />
              <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div> */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            地址
          </label>
          <div className="">
            <input
              name='address'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              maxLength={50}
              type="text"
            >
            </input>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            备注
          </label>
          <div className="">
            <input
              name='remarks'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              maxLength={50}
              type="text"
            >
            </input>
          </div>
        </div>
       
      </div>
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

'use client';

import {
  UserCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { updateManagement } from '@/app/lib/actions';
import { useState } from 'react';
import { Switch } from '@nextui-org/react';
export default function UpdateManagementForm({ management }: { management: any }) {
  const [managementState, setManagementState] = useState(management.status);
  const [pwdResetState, setPwdResetState] = useState('0');
  const initialState = { message: null, error: {} }
  const updateManagementWithId = updateManagement.bind(null, management.id);
  const [state, dispatch] = useFormState(updateManagementWithId, initialState)
  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            员工姓名
          </label>
          <div className="relative">
            <input
              name='nickName'
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              maxLength={10}
              defaultValue={management.nickname}
            >
            </input>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            联系方式（账号）
          </label>
          <div className="relative">
            <input
              name='loginName'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              maxLength={13}
              defaultValue={management.login_name}
              type="tel"
            >
            </input>
            <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            状态
          </label>
          <div className="relative">
            <Switch name='status' defaultSelected={managementState == 1 ? true : false} aria-label="Automatic updates" value={managementState} />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            密码重置
          </label>
          <div className="relative">
            <Switch name='pwdReset' aria-label="Automatic updates" value={pwdResetState} />
          </div>
        </div>
        {/* <div className="mb-4">
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
        </div> */}

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/management"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">保存员工</Button>
      </div>
    </form>
  );
}

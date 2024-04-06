'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Switch } from '@nextui-org/react'
import {
  CurrencyYenIcon
} from '@heroicons/react/24/outline';
import { createProject, updateProject, createMaterialType,updateMaterialType } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/app/lib/utils';
export function CustomerRecharge({ customerId: String }) {
  // export function CustomerRecharge({customerId,rechargeAction }: { customerId: String,rechargeAction: (params:any) => void }) {

  const router = useRouter();
  const [amountState, setAmount] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const actionFun = async () => {
    let data = {
      member_id: Number(customerId),
      amount: amountState,
      bill_type: 1,
      user_id: 1,
      ticket_id: 0,
    }
    try {
      const response = await fetch('/api/submitData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      if (response.ok) {
        //刷新会员列表
        router.refresh();
      } else {
        console.error('Failed to submit data');
      }
    } catch (error) {
      console.error('Error submitting data', error);
    }
  }
  //充值金额编辑事件
  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(Number(value))
  }
  return (
    <>
      <div className="text-blue-600 cursor-pointer underline hover:text-blue-500" onClick={onOpen}>
        充值
      </div>
      {/* <button className="text-blue-600 underline hover:text-blue-500" onClick={onOpen}>充值</button> */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">充值中心</ModalHeader>
              <ModalBody>
                <div className="relative">
                  <input
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={onAmountChange}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onClick={actionFun} onPress={onClose}>
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
export function CreateProjrct() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isOpen, setIsOpen] = useState(false);
  // const [tickForm, dispatch] = useState({ ticket_name: '', price: 0 })
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createProject, initialState);
  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">添加项目</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </div>
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">添加项目</ModalHeader>
              <ModalBody>
                <div className="rounded-md bg-gray-50 md:grid-cols-1 lg:grid-cols-1">
                  {/* Customer Name */}
                  <form action={dispatch}>
                    <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
                      {/* Customer Name */}
                      <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          项目名称
                        </label>
                        <div className="relative">
                          <input
                            name='ticket_name'
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            maxLength={10}
                          >
                          </input>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          标价
                        </label>
                        <div className="relative">
                          <input
                            name='price'
                            step='0.01'
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            maxLength={13}
                            type="number"
                          >
                          </input>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        取消
                      </span>
                      <Button type="submit" color='primary' onPress={onClose}>确定</Button>
                    </div>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  确定
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

  );
}
export function UpdateProject({ project }: { project: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectState, setProjectState] = useState(project.enabled);
  const initialState = { message: null, errors: {} }
  const updateProjectWithId = updateProject.bind(null, project.id);
  const [state, dispatch] = useFormState(updateProjectWithId, initialState)
  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-10 items-center rounded-lg  px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <PencilIcon className="w-5" />
      </div>
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">编辑项目</ModalHeader>
              <ModalBody>
                <div className="rounded-md bg-gray-50 md:grid-cols-1 lg:grid-cols-1">
                  <form action={dispatch}>
                    <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
                      <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          项目名称
                        </label>
                        <div className="relative">
                          <input
                            name='ticket_name'
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                            maxLength={10}
                            defaultValue={project.ticket_name}
                          >
                          </input>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          标价
                        </label>
                        <div className="relative">
                          <input
                            name='price'
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            type="number"
                            step="0.01"
                            defaultValue={project.price / 100}
                          >
                          </input>
                          <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          状态
                        </label>
                        <div className="relative">
                          <Switch name='enabled' defaultSelected={projectState == 1 ? true : false} aria-label="Automatic updates" value={projectState} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        取消
                      </span>
                      <Button type="submit" color='primary' onPress={onClose}>确定</Button>
                    </div>
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  确定
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

  );
}
export function CreateInventoryType() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createMaterialType, initialState);
  return (
    <>
      <div
        onClick={onOpen}
        className="cursor-pointer flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">添加类型</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">添加耗材类型</ModalHeader>
              <ModalBody>
              <form action={dispatch}>
                <div className="rounded-md bg-gray-50 md:p-6 grid grid-cols-1 gap-6 grid-cols-1">
                  {/* Customer Name */}
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      类型名称
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        maxLength={30}
                        name='typeName'
                      >
                      </input>
                      {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        onClick={() => onClose()}
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        取消
                      </span>
                      <Button type="submit" color='primary' onPress={onClose}>确定</Button>
                    </div>
                </form>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  确定
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

  );
}
export function UpdateInventoryType({inventoryType}:{inventoryType:any}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [typeState, setTypeState] = useState(inventoryType.status);
  const initialState = { message: null, errors: {} }
  const updateMaterialTypeWithId = updateMaterialType.bind(null, inventoryType.id);
  const [state, dispatch] = useFormState(updateMaterialTypeWithId, initialState)
  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-10 items-center rounded-lg  px-4 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <PencilIcon className="w-5" />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">编辑耗材类型</ModalHeader>
              <ModalBody>
              <form action={dispatch}>
                <div className="rounded-md bg-gray-50 md:p-6 grid grid-cols-1 gap-6 grid-cols-1">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                      类型名称
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-2 text-sm outline-2 placeholder:text-gray-500"
                        maxLength={30}
                        name='typeName'
                        defaultValue={inventoryType.type_name}
                      >
                      </input>
                      {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
                    </div>
                  </div>
                  <div className="mb-4">
                        <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                          状态
                        </label>
                        <div className="relative">
                          <Switch name='status' defaultSelected={typeState == 1 ? true : false} aria-label="Automatic updates" value={typeState} />
                        </div>
                      </div>
                </div>
                <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        onClick={() => onClose()}
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                      >
                        取消
                      </span>
                      <Button type="submit" color='primary' onPress={onClose}>确定</Button>
                    </div>
                </form>
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  确定
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>

  );
}
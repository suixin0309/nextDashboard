'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
import {
  CurrencyYenIcon
} from '@heroicons/react/24/outline';
export function CustomerRecharge({ customerId }: { customerId: String }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isOpen, setIsOpen] = useState(false);
  const actionFun = async () => {
    console.log(customerId)
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
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  />
                  <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
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
  const actionFun = async () => {
  }
  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <span className="hidden md:block">添加项目</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </div>
      {/* <div className="text-blue-600 cursor-pointer underline hover:text-blue-500" onClick={onOpen}>
        充值
      </div> */}
      {/* <button className="text-blue-600 underline hover:text-blue-500" onClick={onOpen}>充值</button> */}
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
                <div className="rounded-md bg-gray-50 md:p-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {/* Customer Name */}
                  <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                      项目名称
                    </label>
                    <div className="relative">
                      <input
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        maxLength={30}
                      >
                      </input>
                      {/* <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" /> */}
                    </div>
                  </div>
                  <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        项目标价
                      </label>
                      <div className="relative">
                        <input
                          name="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                        <CurrencyYenIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
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


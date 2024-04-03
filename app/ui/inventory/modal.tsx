'use client';

import { MaterialTable,MaterialTypeTable } from '@/app/lib/definitions';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
import { createInvoice, createOutMaterial,createMaterial ,createInMaterial} from '@/app/lib/actions'
import { useFormState } from 'react-dom';
import {
  CurrencyYenIcon
} from '@heroicons/react/24/outline';
export function CreateInventory({materialTypeMap}:{materialTypeMap:any}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createMaterial, initialState);
  return (
    <>
      <div
        onClick={onOpen}
        className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
      >
        <span className="hidden md:block">添加耗材</span>{' '}
        <PlusIcon className="h-5 md:ml-4" />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">添加耗材</ModalHeader>
              <ModalBody>
                <form action={dispatch}>
                  <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {/* Customer Name */}
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材姓名
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={10}
                          name='material_name'
                        >
                        </input>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材类型
                      </label>
                      <div className="relative">
                        <select
                          id="customer"
                          name="material_type"
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                        >
                          <option value="" disabled>
                            选择类型
                          </option>
                          {materialTypeMap.map((type:any) => (
                            <option key={type.id} value={type.id}>
                              {type.type_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        备注
                      </label>
                      <div className="">
                        <input
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={50}
                          type="text"
                          name='remarks'
                        >
                        </input>
                      </div>
                    </div>

                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <Button color="danger" variant="light" onPress={onClose}>
                      取消
                    </Button>
                    <Button type='submit' color="primary" onPress={onClose}>
                      确定
                    </Button>
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
export function EditInventory({typesMap, id }: { typesMap:MaterialTypeTable[],id: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createInvoice, initialState);
  // const [isOpen, setIsOpen] = useState(false);
  const actionFun = async () => {
  }
  return (
    <>
      <div className="text-blue-600 cursor-pointer underline hover:text-blue-500" onClick={onOpen}>
        编辑
      </div>
      {/* <button className="text-blue-600 underline hover:text-blue-500" onClick={onOpen}>充值</button> */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">编辑耗材</ModalHeader>
              <ModalBody>
                <form action={dispatch}>
                  <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {/* Customer Name */}
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材姓名
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={10}
                        >
                        </input>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材类型
                      </label>
                      <div className="relative">
                        <select
                          id="customer"
                          name="customerId"
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                        >
                          <option value="" disabled>
                            选择类型
                          </option>
                          {typesMap.map((type:any) => (
                            <option key={type.id} value={type.id}>
                              {type.type_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        备注
                      </label>
                      <div className="">
                        <input
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={50}
                          type="text"
                        >
                        </input>
                      </div>
                    </div>

                  </div>
                  {/* <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          取消
        </Link>
        <Button type="submit">保存会员</Button>
      </div> */}
                </form>
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
export function InRecord({ inventory ,typesMap}: { inventory: MaterialTable,typesMap:MaterialTypeTable[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const createInMaterialWithId = createInMaterial.bind(null, inventory.id);
  const [state, dispatch] = useFormState(createInMaterialWithId, initialState);
  return (
    <>
      <div className="text-blue-600 cursor-pointer underline hover:text-blue-500" onClick={onOpen}>
        入库
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">入库</ModalHeader>
              <ModalBody>
                <form action={dispatch}>
                  <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {/* Customer Name */}
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材姓名
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          defaultValue={inventory.name}
                          maxLength={10}
                          disabled
                          name='material_name'
                        >
                        </input>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材类型
                      </label>
                      <div className="relative">
                        <input type="numer" defaultValue={inventory.type_id} className='hidden' name='material_type' />
                        <select
                          id="customer"
                          defaultValue={inventory.type_id}
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          disabled
                        >
                          <option value="" disabled>
                            选择类型
                          </option>
                          {typesMap.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.type_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        入库数量
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          type='number'
                          min={1}
                          max={9999}
                          name='nums'
                        >
                        </input>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        总金额
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          type='number'
                          min={1}
                          step={0.01}
                          max={9999}
                          name='price'
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
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={50}
                          type="text"
                          name='remarks'
                        >
                        </input>
                      </div>
                    </div>

                  </div>
                  <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        onClick={onClose}
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
                <Button color="primary" onPress={onClose} type="submit">
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
export function OutRecord({ inventory ,typesMap}: { inventory: MaterialTable,typesMap: MaterialTypeTable[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialState = { message: null, errors: {} }
  const createOutMaterialWithId = createOutMaterial.bind(null, inventory.id);
  const [state, dispatch] = useFormState(createOutMaterialWithId, initialState);
  // const [isOpen, setIsOpen] = useState(false);
  const actionFun = async () => {
  }
  return (
    <>
      <div className="text-blue-600 cursor-pointer underline hover:text-blue-500" onClick={onOpen}>
        出库
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">出库</ModalHeader>
              <ModalBody>
                <form action={dispatch}>
                  <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {/* Customer Name */}
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材姓名
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          defaultValue={inventory.name}
                          maxLength={10}
                          disabled
                        >
                        </input>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        耗材类型
                      </label>
                      <div className="relative">
                      <input type="numer" defaultValue={inventory.type_id} className='hidden' name='material_type' />
                        <select
                          id="customer"
                          defaultValue={inventory.type_id}
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          disabled
                        >
                          <option value="" disabled>
                            选择类型
                          </option>
                          {typesMap.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.type_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        出库数量
                      </label>
                      <div className="relative">
                        <input
                          className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
                          type='number'
                          min={1}
                          max={9999}
                          name='nums'
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
                          className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                          maxLength={50}
                          type="text"
                          name='remarks'
                        >
                        </input>
                      </div>
                    </div>

                  </div>
                  <div className="mt-6 flex justify-end gap-4 mr-4 mb-4">
                      <span
                        onClick={onClose}
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
                <Button color="primary" onPress={onClose} type="submit">
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

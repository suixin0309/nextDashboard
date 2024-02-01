'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { NextUIProvider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'

export default function CustomerRecharge({ customerId }: { customerId: String }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isOpen, setIsOpen] = useState(false);
  const actionFun = async () => {
    console.log(customerId)
  }
  return (
    <>
      {/* <NextUIProvider> */}
        <button className="text-blue-600 underline hover:text-blue-500" onClick={onOpen}>充值</button>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Nullam pulvinar risus non risus hendrerit venenatis.
                    Pellentesque sit amet hendrerit risus, sed porttitor quam.
                  </p>
                  <p>
                    Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                    dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                    Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      {/* </NextUIProvider> */}
    </>
  );
}



import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import Payment from "./Payment";
const Charity = ({ payment }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");

  return (
    <div>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-10 mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
              partner Charities{" "}
            </h1>

            <p className="max-w-lg mx-auto mt-4 text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
              veritatis sint autem nesciunt, laudantium quia tempore delect
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
            <div>
              <img
                className="relative z-10 object-cover w-full rounded-md h-96"
                src="https://images.unsplash.com/photo-1644018335954-ab54c83e007f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt=""
              />

              <div className="relative z-20 max-w-lg p-6 mx-auto -mt-20 bg-white rounded-md shadow dark:bg-gray-900">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline dark:text-white md:text-xl"
                >
                  International Tree Growers
                </a>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
                  veritatis sint autem nesciunt, laudantium quia tempore delect
                </p>

                <ButtonGroup gap="1">
                  <button
                    className="btn btn-primary"
                    id="International Tree Growers"
                    onClick={(e) => {
                      onOpen();
                      setName(e.currentTarget.id);
                    }}
                  >
                    Donate
                  </button>
                  <button className="btn btn ">View</button>
                </ButtonGroup>
              </div>
            </div>
            <div>
              <img
                className="relative z-10 object-cover w-full rounded-md h-96"
                src="https://images.unsplash.com/photo-1644018335954-ab54c83e007f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt=""
              />

              <div className="relative z-20 max-w-lg p-6 mx-auto -mt-20 bg-white rounded-md shadow dark:bg-gray-900">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline dark:text-white md:text-xl"
                >
                  Trees Planters
                </a>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
                  veritatis sint autem nesciunt, laudantium quia tempore delect
                </p>
                <ButtonGroup gap="1">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      onOpen();
                      setName(e.currentTarget.id);
                    }}
                  >
                    Donate
                  </button>

                  <button className="btn btn ">View</button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody className="bg-gray-300">
            <Payment name={name} payment={payment} />
          </ModalBody>
          <ModalFooter className="bg-gray-300">
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Charity;

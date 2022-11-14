import React from "react";
import {
  faCar,
  faSubway,
  faCodeCompare,
} from "@fortawesome/free-solid-svg-icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  ModalCloseButton,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { useAlert } from "react-alert";
import { positions, transitions, types } from "react-alert";

import { UserAuth } from "./context/AuthContext";

const CreditsPost = ({ transitC0, carC0, driveRoute }) => {
  const { user } = UserAuth();
  const walletsRef = collection(db, "wallets");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [pendingAmount, setPendingAmount] = useState(0);

  const alert = useAlert();

  const createWallet = async () => {
    await addDoc(walletsRef, {
      email: user.email,
      amount: pendingAmount,
      deposit: true,
    });
  };

  const credit = (txt) => {
    let num = parseFloat(txt);
    if (txt && txt.includes("Kg") === true)
      return `${(parseFloat(num) * 0.06).toFixed(2)}`;
    else return `${((parseFloat(num) / 1000) * 0.06).toFixed(2)}`;
  };

  const larger = (num, num2) => {
    if (num && num2 && num > num2) {
      return (num - num2).toFixed(2);
    } else return (num2 - num).toFixed(2);
  };

  const data = [
    {
      num: 3,
      value: "Difference",
      icon: <FontAwesomeIcon icon={faCodeCompare} />,
      amount: larger(credit(transitC0), credit(carC0)),
    },
    {
      num: 1,
      value: "Driving",
      amount: credit(carC0),
      icon: <FontAwesomeIcon icon={faCar} />,
    },

    {
      num: 2,
      value: "Transit",
      amount: credit(transitC0),
      icon: <FontAwesomeIcon icon={faSubway} />,
    },
  ];
  return (
    <div className="shadow-lg rounded-lg w-96 pb-5 ">
      <div className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-8 mx-auto ">
          <p className="text-xl text-center text-gray-800 dark:text-gray-300">
            How much carbon are you willing to offset for this journey?
          </p>

          <div className="mt-6 space-y-8 xl:mt-12">
            {data.map(({ value, num, amount, icon }) => (
              <div>
                <button
                  onClick={() => {
                    onOpen();
                    setPendingAmount(parseFloat(amount));
                  }}
                  className=" flex btn btn-outline btn-primary px-8 py-4 pb-12 items-center  w-80  justify-between"
                >
                  <div className="flex items-center">
                    {icon}
                    <div className="flex flex-col items-center mx-5 space-y-1">
                      <h2 className="text-lg font-medium  sm:text-1xl ">
                        {value}
                      </h2>
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold  sm:text-2xl ">
                    $ {amount}
                  </h2>
                </button>

                <Modal onClose={onClose} isOpen={isOpen} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    {/* <ModalHeader>Yaay!!</ModalHeader> */}
                    <ModalCloseButton />
                    <ModalBody className="text-center p-5 mt-12">
                      <h2 className=" sm:text-2xl text-gray-500 ">
                        You are subtracting $ {pendingAmount} from your donation
                        wallet
                      </h2>
                      <br />
                      <h2 className=" sm:text-1xl text-gray-400 ">
                        You can grow your donation wallet and top up at any time
                      </h2>
                    </ModalBody>

                    <ModalFooter>
                      <ButtonGroup gap="5">
                        <button onClick={onClose} className="btn btn-secondary">
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            createWallet();
                            alert.success("Thank you for your pledge");
                          }}
                          className="btn btn-primary"
                        >
                          Okay
                        </button>
                      </ButtonGroup>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPost;

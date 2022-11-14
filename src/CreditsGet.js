import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { UserAuth } from "./context/AuthContext";
import { Input } from "@chakra-ui/react";
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
} from "@chakra-ui/react";
import Charity from "./Charity";
import { useAlert } from "react-alert";
import { positions, transitions, types } from "react-alert";

const CreditsGet = ({ route }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = UserAuth();
  const [deposited, setDeposited] = useState(0);
  const [paid, setPaid] = useState(0);
  const [payment, setPayment] = useState(0);
  const [sumDeposit, setSumDeposit] = useState(0);
  const [sumPayment, setSumPayment] = useState(0);
  const [array, setArray] = useState([]);
  const walletRef = collection(db, "wallets");
  let depsum = 0;
  let paidsum = 0;

  const alert = useAlert();

  useEffect(() => {
    const getCarId = async () => {
      const q = query(
        walletRef,
        where("email", "==", user.email),
        where("deposit", "==", true)
      );
      const q2 = query(
        walletRef,
        where("email", "==", user.email),
        where("deposit", "==", false)
      );

      const data = await getDocs(q);
      setDeposited(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const data2 = await getDocs(q2);
      setPaid(data2.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      {
        deposited &&
          deposited.forEach((element) => {
            depsum += element.amount;
          });
      }

      setSumDeposit(depsum.toFixed(2));
      {
        paid &&
          paid.forEach((element) => {
            paidsum += element.amount;
          });
      }
      setSumPayment(paidsum.toFixed(2));
    };
    getCarId();
  }, [user, route, payment, deposited]);

  const createWallet = async (e) => {
    await addDoc(walletRef, {
      email: user.email,
      amount: parseFloat(payment),
      deposit: false,
    });
  };

  const alertFunc = () => {
    alert = (
      <div role="alert">
        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
          Danger
        </div>
        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>Something not ideal might be happening.</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="card w-96 bg-base-100 shadow-xl ">
        <figure className="px-10 pt-10">
          <img src="/nature.jpg" alt="Shoes" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl  text-gray-800 ">
            Current Wallet: $
            {sumPayment && sumDeposit && (sumPayment - sumDeposit).toFixed(2)}
          </h2>
          <div data-tip="This is the text of the tooltip2">
            <Input
              placeholder="from $1"
              size="md"
              onChange={(e) => setPayment(e.target.value)}
              type="number"
              variant="outline"
            />
          </div>

          <p className="text-gray-500"></p>
          <div className="card-actions">
            <label
              className="btn btn-primary"
              onClick={(e) => {
                if (payment === 0) alert.error("Kindly add an amount");
                else onOpen();
              }}
            >
              Donate to a cause
            </label>
          </div>
        </div>
      </div>

      <Modal onClose={onClose} size="xl" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Charity payment={payment} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CreditsGet;

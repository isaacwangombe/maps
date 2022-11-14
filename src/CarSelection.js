import React, { useRef } from "react";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { Box, Input } from "@chakra-ui/react";
import { UserAuth } from "./context/AuthContext";
import {
  HStack,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

const CarSelection = ({ refresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { logOut, user } = UserAuth();

  const [make, setMake] = useState([]);
  const [makeIcon, setMakeIcon] = useState("");
  const [makeInput, setMakeInput] = useState("");
  const [makeInputQuery, setMakeInputQuery] = useState("");

  const [model, setModel] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [modelInputQuery, setModelInputQuery] = useState("");

  const [date, setDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [dateInputQuery, setDateInputQuery] = useState("");

  const [car, setCar] = useState("");

  const [reset, setReset] = useState("");

  const [userCar, setUserCar] = useState("");

  const makeRef = collection(db, "car_make");
  const modelRef = collection(db, "car_model");
  const dateRef = collection(db, "car_date");
  const carRef = collection(db, "car_collection");
  const userRef = collection(db, "users");

  const [id, setId] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      const q = query(userRef, where("email", "==", user.email));

      const data = await getDocs(q);
      data.forEach((doc) => {
        console.log("data", doc.id, " => ", doc.id);
        setId(doc.id);
      });
    };
    const getMake = async () => {
      const data = await getDocs(makeRef);
      // // console.log(data);
      setMake(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getMake();
    getUsers();
  }, [user, model, reset]);

  const searchModel = (e) => {
    const q = query(modelRef, where("make", "==", e.currentTarget.id));
    const getModel = async () => {
      const data = await getDocs(q);
      console.log(data);
      setModel(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getModel();
  };

  const searchDate = (e) => {
    const q = query(
      dateRef,
      where("make", "==", makeInput),
      where("model", "==", e.currentTarget.id)
    );
    const getDate = async () => {
      const data = await getDocs(q);
      console.log(
        "model",
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setDate(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getDate();
  };

  const searchCar = (e) => {
    const q = query(
      carRef,
      where("make", "==", makeInput),
      where("model", "==", modelInput),
      where("year", "==", parseInt(e.currentTarget.id))
    );
    const getCar = async () => {
      const data = await getDocs(q);
      console.log(
        "car",
        data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
      setCar(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getCar();
  };

  const addUserCar = async (e) => {
    console.log(e.currentTarget.id);
    const userDoc = doc(db, "users", id);
    const newFields = { car: e.currentTarget.id };
    // await addDoc(usersCollectionRef, { car: newCar });
    await updateDoc(userDoc, newFields);
    refresh("refresh");
  };

  const addBaseUserCar = async (e) => {
    const userDoc = doc(db, "users", id);
    const newFields = { car: "ata3Azxk5Y38Yt7cQnA1" };
    // await addDoc(usersCollectionRef, { car: newCar });
    await updateDoc(userDoc, newFields);
    refresh("refresh");
  };
  //

  const confirmBack = () => {
    setCar("");
    setDateInput("");
  };

  const dateBack = () => {
    setDate("");
    setDateInput("");
    setModelInput("");
  };

  const modelBack = () => {
    setModel("");
    setDateInput("");
    setMakeInput("");
    setModelInput("");
  };

  return (
    <div className="shadow-lg rounded-lg w-94 p-5 text-gray-800">
      {model ? (
        <Box>
          <img className="h-44" src={makeIcon} />
          {/* <p>{makeInputQuery}</p>
          <p>{modelInputQuery}</p> */}
        </Box>
      ) : (
        <div>
          <div>
            <p>
              Kindly input your car information<br></br> for a more accurate
              user experience
            </p>
            <br></br>
            <Input
              required
              id="make"
              name="make"
              type="text"
              autocomplete="off"
              placeholder="make"
              value={makeInput.toLowerCase()}
              class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
              onChange={(e) =>
                setMakeInputQuery(e.target.value) & setMakeInput(e.target.value)
              }
            />
          </div>

          {make &&
            makeInputQuery.length >= 1 &&
            make
              .filter((make) =>
                make.make.toLowerCase().startsWith(makeInputQuery)
              )
              .map((make) => {
                return (
                  <ul className="menu bg-base-100 w-56 p-2 rounded-box">
                    <li
                      key={make.id}
                      id={make.make}
                      onClick={(e) =>
                        setMakeInputQuery(make.make) &
                        setMakeInput(make.make) &
                        searchModel(e) &
                        setMakeIcon(make.logo)
                      }
                    >
                      <div>
                        <img className="w-20 h-auto" src={make.logo} />
                        <p>{make.make}</p>
                      </div>
                    </li>
                  </ul>
                );
              })}
        </div>
      )}
      {model && date
        ? null
        : model && (
            <div>
              <div className="">
                <Input
                  required
                  id="model"
                  name="model"
                  type="text"
                  autocomplete="off"
                  placeholder="model"
                  value={modelInput.toLowerCase()}
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  onChange={(e) =>
                    setModelInputQuery(e.target.value) &
                    setModelInput(e.target.value)
                  }
                />
              </div>

              {model &&
                modelInputQuery.length >= 1 &&
                model
                  .filter((model) =>
                    model.model.toLowerCase().startsWith(modelInputQuery)
                  )
                  .map((model) => {
                    return (
                      <div key={model.id} className="">
                        <ul
                          className="menu bg-base-100 w-56 p-2 rounded-box"
                          id={model.model}
                          onClick={(e) =>
                            setModelInputQuery(model.model) &
                            setModelInput(model.model) &
                            searchDate(e)
                          }
                        >
                          <li>
                            <a>{model.model}</a>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
              <button className="btn  mt-3" onClick={modelBack}>
                Go back
              </button>
            </div>
          )}
      {car
        ? null
        : date && (
            <div>
              <div>
                <Input
                  required
                  id="model"
                  name="model"
                  type="number"
                  autocomplete="off"
                  placeholder="Year"
                  value={dateInput}
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  onChange={(e) =>
                    setDateInputQuery(e.target.value) &
                    setDateInput(e.target.value)
                  }
                />
              </div>

              {date &&
                dateInputQuery.length >= 0 &&
                date
                  // .filter((date) => date.date.toLowerCase().startsWith(dateInputQuery))
                  .map((date) => {
                    return (
                      <div key={date.id} className="">
                        <ul
                          className="menu bg-base-100 w-56 rounded-box"
                          id={date.year}
                          onClick={(e) =>
                            setDateInputQuery(date.year) &
                            setDateInput(date.year) &
                            searchCar(e) &
                            console.log(car)
                          }
                        >
                          <li>
                            <a>{date.year}</a>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
              <button className="btn mt-3" onClick={dateBack}>
                Go back
              </button>
            </div>
          )}
      <div>
        {car &&
          car.map((car) => {
            return (
              <div>
                <div className="">
                  <p>{car.make}</p>
                  <p>{car.model}</p>
                  <p>{car.year}</p>
                </div>
                <div>
                  <button className="btn mr-3" onClick={confirmBack}>
                    Go back
                  </button>
                  <button
                    className="btn btn-primary"
                    id={car.id}
                    onClick={addUserCar}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <br />
      <br />
      <Text>Cannot find your car? </Text>
      <Text
        className="cursor-pointer text-blue-600 underline"
        onClick={() => {
          onOpen();
          setReset("base");
        }}
      >
        Select Average
      </Text>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Having trouble finding your car?</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="text-center">
            You can still track your average consumption using a base car
            <br />
            <br /> sorry for any inconvenience
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => addBaseUserCar()} variant="ghost">
              Add Base Car
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CarSelection;

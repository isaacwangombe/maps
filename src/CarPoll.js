import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase-config";
import { UserAuth } from "./context/AuthContext";
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Divider,
} from "@chakra-ui/react";
import CarSelection from "./CarSelection";
import Signin from "./Signin";
import Trees from "./Trees";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
const Pollution = ({ distance, distanceVal, route, chooseCarC0, duration }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = UserAuth();

  const [userCarId, setUserCarId] = useState("");
  const [carPoll, setCarPoll] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [pollution, setPollution] = useState("");

  const userRef = collection(db, "users");
  const carRef = collection(db, "car_collection");

  useEffect(() => {
    const getCarId = async () => {
      const q = query(userRef, where("email", "==", user.email));

      const data = await getDocs(q);
      data.forEach((doc) => {
        setUserCarId(doc.data().car);
      });
    };
    getCarId();
  }, [user, route]);

  useEffect(() => {
    const getCar = async () => {
      const carQuery = query(carRef, where("__name__", "==", userCarId));
      const data = await getDocs(carQuery);
      data.forEach((doc) => {
        setCarPoll(doc.data().C02_gpm);
        setCarMake(doc.data().make);
        setCarModel(doc.data().model);
      });
    };
    getCar();
  }, [userCarId]);

  useEffect(() => {
    const calculatePollution = () => {
      let distanceKm = distanceVal / 1000;
      let carPollPerKm = carPoll * 0.621371;
      let poll = carPollPerKm * distanceKm;
      if (poll > 1000) {
        setPollution((poll / 1000).toFixed(2) + " Kg");
        chooseCarC0((poll / 1000).toFixed(2) + " Kg");
      } else {
        setPollution(poll.toFixed(2) + " g");
        chooseCarC0(poll.toFixed(2) + " g");
      }
    };
    chooseCarC0(pollution);
    calculatePollution();
  }, [carPoll, route]);

  return (
    <Box>
      <StatGroup>
        <Stat>
          <FontAwesomeIcon icon={faCar} />

          <StatLabel>CO2 Produced</StatLabel>
          <StatNumber>{pollution}</StatNumber>
          <StatHelpText>
            {distance} <Divider orientation="vertical" />
            {duration}
          </StatHelpText>
        </Stat>
      </StatGroup>
      {/* <p>driving {drivingC0}</p>
        <p>Distance {drivingDis}</p>
        <p>Duration {drivingDur}</p> */}
    </Box>
  );
};

export default Pollution;

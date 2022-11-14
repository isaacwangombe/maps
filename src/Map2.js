import React from "react";
import {
  SkeletonText,
  Input,
  Button,
  ButtonGroup,
  Select,
  IconButton,
  VStack,
  Alert,
  AlertIcon,
  Menu,
  MenuButton,
  MenuList,
  HStack,
  MenuItem,
  Avatar,
  Box,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faLocation, faRefresh, faX } from "@fortawesome/free-solid-svg-icons";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import { db } from "./firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";
import CarSelection from "./CarSelection";
import Protected from "./Protected";
import Signin from "./Signin";
import { UserAuth } from "./context/AuthContext";
import Pollution from "./CarPoll";
import Transit from "./Transit";
import Mode from "./Mode";
import Compare from "./Compare";
import Navbar from "./Navbar";
import { useAlert } from "react-alert";
import { positions, transitions, types } from "react-alert";

const center = { lat: -1.2472, lng: 36.6791 };

const Map2 = () => {
  const { user } = UserAuth();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [models, setModels] = useState([]);
  const [modelSearch, setModelSearch] = useState("");
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const ModelsRef = collection(db, "demo_car_models");
  const userRef = collection(db, "users");
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [transDirectionsResponse, setTransDirectionsResponse] = useState(null);
  const [driveDirectionsResponse, setDriveDirectionsResponse] = useState(null);

  const [transDistance, setTransDistance] = useState("");
  const [transDistanceVal, setTransDistanceVal] = useState(0);
  const [transDuration, setTransDuration] = useState("");
  const [transRoute, setTransRoute] = useState([]);

  const [driveDistance, setDriveDistance] = useState("");
  const [driveDistanceVal, setDriveDistanceVal] = useState(0);
  const [driveDuration, setDriveDuration] = useState("");
  const [driveRoute, setDriveRoute] = useState([]);

  const [currLocation, setCurrLocation] = useState(center);
  const [unit, setUnit] = useState("");
  const [reset, setReset] = useState("");
  const [resetLogout, setResetLogout] = useState("5");
  const [calc, setCalc] = useState(0);

  const [userCarId, setUserCarId] = useState("");

  const [modes, setModes] = useState("");
  const alert = useAlert();

  const redirect = (reset) => {
    setReset(reset);
  };

  const setResetSignout = (resetLogout) => {
    setResetLogout(resetLogout);
  };

  const setMode = (modes) => {
    setModes(modes);
  };

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  useEffect(() => {
    const getCarId = async () => {
      const q = query(userRef, where("email", "==", user.email));

      const data = await getDocs(q);
      data.forEach((doc) => {
        setUserCarId(doc.data().car);
      });
    };
    getCarId();

    const getModels = async () => {
      const data = await getDocs(ModelsRef);
      setModels(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getModels();

    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });
    function successLocation(position) {
      setCurrLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function errorLocation() {
      setCurrLocation(center);
    }
  }, [user, reset, userCarId, resetLogout]);

  const [error, serError] = useState("");

  const calculateRoute = async () => {
    if (
      // originRef.current.value === "" ||
      destinationRef.current.value === ""
    ) {
      return;
    }

    let transResults;
    let driveResults;
    try {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      if (originRef.current.value === "") {
        transResults = await directionsService.route({
          // origin: originRef.current.value,
          origin: currLocation,

          // destination: center,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: "TRANSIT",
          // eslint-disable-next-line no-undef,
        });
        driveResults = await directionsService.route({
          // origin: originRef.current.value,
          origin: currLocation,

          // destination: center,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: "DRIVING",
          // eslint-disable-next-line no-undef,
        });
      } else {
        transResults = await directionsService.route({
          origin: originRef.current.value,
          //  origin: origin,

          // destination: center,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: "TRANSIT",
          // eslint-disable-next-line no-undef,
        });
        driveResults = await directionsService.route({
          origin: originRef.current.value,
          //  origin: origin,

          // destination: center,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: "DRIVING",
          // eslint-disable-next-line no-undef,
        });
      }
    } catch (e) {
      console.log("error", e);
      let error = e.message.split(":");
      serError(
        <Alert status="error">
          <AlertIcon />
          {error[2]}
        </Alert>
      );

      const clearError = () => {
        serError("");
      };

      setTimeout(clearError, 5000);

      return;
    }
    setTransDirectionsResponse(transResults);
    setDriveDirectionsResponse(driveResults);

    setTransDistance(transResults.routes[0].legs[0].distance.text);
    setTransDistanceVal(transResults.routes[0].legs[0].distance.value);
    setTransDuration(transResults.routes[0].legs[0].duration.text);
    setTransRoute(transResults.routes[0].legs[0].steps);

    setDriveDistance(driveResults.routes[0].legs[0].distance.text);
    setDriveDistanceVal(driveResults.routes[0].legs[0].distance.value);
    setDriveDuration(driveResults.routes[0].legs[0].duration.text);
    setDriveRoute(driveResults.routes[0].legs[0].steps);

    // console.log(results.routes[0].legs[0].steps);
    // console.log(results.routes[0].legs[0].steps.travelMode);
  };
  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <div>
      <Flex
        // position="relative"
        // flexDirection="column"
        alignItems="left"
        h="100vh"
        w="100vw"
      >
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          <GoogleMap
            center={currLocation}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={currLocation} />
            {transDirectionsResponse &&
            driveDirectionsResponse &&
            modes === "TRANSIT" ? (
              <DirectionsRenderer directions={transDirectionsResponse} />
            ) : (
              <DirectionsRenderer directions={driveDirectionsResponse} />
            )}
            {error}
          </GoogleMap>
        </Box>
        <Box
          // p={4}
          borderRadius="lg"
          // m={5}
          bgColor="white"
          shadow="base"
          position="relative"
          // minW="container.md"
          zIndex="1"
          style={{ overflow: "scroll", direction: "rtl" }}
        >
          <VStack
            spacing={2}
            className="w-96 shadow-md  mb-3 pb-5 pt-5"
            style={{ direction: "ltr" }}
          >
            <Image boxSize="200px" className="m-1" src="logo.png" />

            {user && user.displayName}
            <HStack>
              <FontAwesomeIcon
                icon={faLocation}
                onClick={() => (originRef.current.value = "")}
                style={{ direction: "ltr" }}
              />

              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Current Location"
                  ref={originRef}
                  //
                  ClassName="z-20 w-1/2 flipped"
                  autocomplete="off"
                />
              </Autocomplete>
            </HStack>

            <HStack>
              <FontAwesomeIcon
                icon={faRefresh}
                onClick={() => (destinationRef.current.value = "")}
              />

              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
            </HStack>
            <p>{unit}</p>
            <ButtonGroup>
              <button
                className="btn btn-outline btn-primary"
                type="submit"
                onClick={() => {
                  if (destinationRef.current.value === "")
                    return alert.error("Kindly select a destination", {
                      timeout: 2000,
                    });
                  else calculateRoute();
                }}
              >
                Calculate CO2 Emmissions
              </button>
            </ButtonGroup>
          </VStack>
          <VStack style={{ direction: "ltr" }}>
            {userCarId ? (
              <Compare
                transDistance={transDistance}
                transDistanceVal={transDistanceVal}
                transDuration={transDuration}
                transRoute={transRoute}
                driveDistance={driveDistance}
                driveDistanceVal={driveDistanceVal}
                driveDuration={driveDuration}
                driveRoute={driveRoute}
                setMode={setMode}
              />
            ) : (
              <Signin redirect={redirect} style={{ direction: "ltr" }} />
            )}
          </VStack>
          <Navbar setResetSignout={setResetSignout} />
        </Box>
      </Flex>
    </div>
  );
};

export default Map2;

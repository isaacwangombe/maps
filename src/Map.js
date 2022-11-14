import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  position,
  SkeletonText,
  Text,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import { db } from "./firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faCar } from "@fortawesome/free-solid-svg-icons";
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

const center = { lat: -1.2472, lng: 36.6791 };

function Map() {
  const { googleSignIn, user } = UserAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [models, setModels] = useState([]);
  const [modelSearch, setModelSearch] = useState("");
  const [modelSearchQuery, setModelSearchQuery] = useState("");
  const ModelsRef = collection(db, "demo_car_models");
  const userRef = collection(db, "users");

  useEffect(() => {
    const getModels = async () => {
      const data = await getDocs(ModelsRef);
      console.log(data);
      setModels(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getModels();

    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });
    function successLocation(position) {
      console.log(position);
      setCurrLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function errorLocation() {
      setCurrLocation(center);
    }
  }, []);

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [distanceVal, setDistanceVal] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currLocation, setCurrLocation] = useState(center);
  const [mode, setMode] = useState("TRANSIT");
  const [unit, setUnit] = useState("");
  const [route, setRoute] = useState(null);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    // if (originRef.current.value === "" || destinationRef.current.value === "") {
    //   return;
    // }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      // origin: currLocation,
      origin: originRef.current.value,
      // destination: center,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: mode,
      // eslint-disable-next-line no-undef,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDistanceVal(results.routes[0].legs[0].distance.value);
    setDuration(results.routes[0].legs[0].duration.text);
    setRoute(results.routes[0].legs[0].steps);
    console.log(results.routes[0].legs[0].steps);
    // console.log(results.routes[0].legs[0].steps.travelMode);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance(0);
    setDuration(0);
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  var pollPage;
  if (mode === "DRIVING") {
    pollPage = <Pollution distance={distance} distanceVal={distanceVal} />;
  } else if (mode === "TRANSIT") {
    pollPage = <Transit route={route} />;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map box */}
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
          {/* Displaying Markers or directions */}
          <Marker position={currLocation} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="5"
      >
        <HStack spacing={4}>
          <Autocomplete>
            <Input type="text" placeholder="Origin" ref={originRef} />
          </Autocomplete>

          <Autocomplete>
            <Input type="text" placeholder="Destination" ref={destinationRef} />
          </Autocomplete>
          <Select
            placeholder="Select Mode"
            onChange={(e) => {
              setMode(e.target.value);
            }}
          >
            <option value="DRIVING">Driving</option>
            <option value="WALKING">Walking</option>
            <option value="BICYCLING">Bicycling</option>
            <option value="TRANSIT">Transit</option>
          </Select>

          <p>{unit}</p>
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack>
          <button className="btn btn-outline btn-primary focus:bg-violet-700 focus:ring focus:ring-violet-300 rounded-full">
            <FontAwesomeIcon icon={faCar} />
          </button>

          <Button
            // onClick={onOpen}
            className="hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300"
          >
            <FontAwesomeIcon icon={faCoffee} />
            Open Modal
          </Button>

          {/* <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{user ? <CarSelection /> : <Signin />}</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
              </ModalFooter>
            </ModalContent>
          </Modal> */}
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration}</Text>
          {pollPage}
          {/* <p>lat {position && position.coords.longitude}</p> */}
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(currLocation)}
          />
        </HStack>
      </Box>
      <Button colorScheme="blue" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        placement="left"
        className="z-10"
        size="sm"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              <Autocomplete className="z-20  w-1/2">
                <Input
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  ClassName="z-20 w-1/2"
                />
              </Autocomplete>

              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
              <Select
                placeholder="Select Mode "
                onChange={(e) => {
                  setMode(e.target.value);
                }}
              >
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="TRANSIT">Transit</option>
              </Select>

              <p>{unit}</p>
              <ButtonGroup>
                <Button
                  colorScheme="pink"
                  type="submit"
                  onClick={calculateRoute}
                >
                  Calculate Route
                </Button>
                <IconButton
                  aria-label="center back"
                  icon={<FaTimes />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
            Open drawer
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <VStack spacing={4} className="z-20">
              <Autocomplete className="z-20  w-1/2 bg-blue-200">
                <Input
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  ClassName="z-20 w-1/2"
                />
              </Autocomplete>

              <Autocomplete>
                <Input
                  type="text"
                  placeholder="Destination"
                  ref={destinationRef}
                />
              </Autocomplete>
              <Select
                placeholder="Select Mode "
                onChange={(e) => {
                  setMode(e.target.value);
                }}
              >
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="TRANSIT">Transit</option>
              </Select>

              <p>{unit}</p>
              <ButtonGroup>
                <Button
                  colorScheme="pink"
                  type="submit"
                  onClick={calculateRoute}
                >
                  Calculate Route
                </Button>
                <IconButton
                  aria-label="center back"
                  icon={<FaTimes />}
                  onClick={clearRoute}
                />
              </ButtonGroup>
            </VStack>
          </ul>
        </div>
      </div>
    </Flex>
  );
}

export default Map;

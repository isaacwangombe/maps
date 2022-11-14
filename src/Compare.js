import React, { useEffect, useState } from "react";
import Pollution from "./CarPoll";
import Transit from "./Transit";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Box,
  HStack,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faSubway,
  faCodeCompare,
} from "@fortawesome/free-solid-svg-icons";
import CarSelection from "./CarSelection";
import Trees from "./Trees";
import CreditsPost from "./CreditsPost";
import CreditsGet from "./CreditsGet";

const Compare = ({
  transDistance,
  transDistanceVal,
  transDuration,
  transRoute,
  driveDistance,
  driveDistanceVal,
  driveDuration,
  driveRoute,
  setMode,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [carC0, setCarC0] = useState();

  const [transitC0, setTransitC0] = useState(0);
  const [transitMode, setTransitMode] = useState([]);

  // const [mode, setMode] = useState("");
  const [compare, setCompare] = useState("");

  const chooseCarC0 = (carC0) => {
    setCarC0(carC0);
  };

  const chooseTransitC0 = (transitC0) => {
    setTransitC0(transitC0);
  };

  const chooseTransMode = (transitMode) => {
    setTransitMode(transitMode);
  };

  let pollutionCar;
  let pollutionTrans;
  let creditsPost;
  let creditsGet;
  let stat;

  const splitTime = (n) => {
    let time = n;
    let split = time.split(" ");

    if (split.length > 2) {
      let minHr = parseInt(split[0]) * 60;
      let min = minHr + parseInt(split[2]);
      return parseInt(min);
    } else return split[0];
  };

  const combineTime = (n) => {
    let time = parseInt(n);
    let ref;
    let sign = Math.sign(n);
    switch (sign) {
      case 1:
        ref = "faster";
        break;
      case -1:
        ref = "slower";
        time = parseInt(n) * -1;
        break;
      default:
    }

    let hrs = parseInt(time / 60);

    let num = 3;
    if ((hrs % 0 === 0) & (hrs > 1)) return `${hrs} hrs  ${ref}`;
    else if ((hrs % 0 === 0) & (hrs == 1)) return `${num} hr  ${ref}`;
    else {
      let min = time - hrs * 60;
      if (hrs > 0) return ` ${hrs} hrs ${min} min ${ref}`;
      else return `${hrs} hr ${min} min  ${ref}`;
    }
  };

  // const comparisons = () => {

  const compCOs = (n) => {
    let amount = n.toFixed(2);
    let sign = Math.sign(n);

    switch (sign) {
      case 1:
        return `${amount} Kg C02`;
        break;
      case 0:
        return `${amount} Kg C02`;
        break;
      case -1:
        return `${amount} Kg C02`;
        break;
    }
  };

  {
    creditsGet = (
      <CreditsGet
        className="shadow-lg rounded-lg w-44 p-5"
        route={driveRoute}
      ></CreditsGet>
    );
  }

  {
    creditsPost = (
      <CreditsPost
        className="shadow-lg rounded-lg w-44 p-5"
        transitC0={transitC0}
        route={driveRoute}
        carC0={carC0}
      ></CreditsPost>
    );
  }

  {
    pollutionCar = (
      <Box
        onClick={() => setMode("DRIVING")}
        className="shadow-lg rounded-lg w-44 p-5 h-40 min-h-full text-gray-800 bg-blue-200 cursor-pointer"
      >
        <Pollution
          distance={driveDistance}
          distanceVal={driveDistanceVal}
          duration={driveDuration}
          chooseCarC0={chooseCarC0}
          compare={compare}
          route={driveRoute}
        />
      </Box>
    );
  }
  {
    pollutionTrans = (
      <Box
        onClick={() => setMode("TRANSIT")}
        className="shadow-lg rounded-lg w-44 p-5  h-40 min-h-full text-gray-800  bg-blue-200 cursor-pointer"
      >
        <Transit
          route={transRoute}
          chooseTransitC0={chooseTransitC0}
          chooseTransMode={chooseTransMode}
          duration={transDuration}
          distance={transDistance}
          compare={compare}
        />
      </Box>
    );
  }

  {
    {
      stat = (
        <div className="shadow-lg w-96 p-3 py-10">
          <StatGroup className="">
            <Stat>
              {carC0 &&
                transitC0 &&
                (carC0 > transitC0 ? (
                  <Box className="text-primary">
                    <FontAwesomeIcon icon={faSubway} />
                    <StatLabel>saves</StatLabel>
                    <StatNumber>
                      {compCOs(parseFloat(carC0) - parseFloat(transitC0))}
                    </StatNumber>
                    {splitTime(driveDuration) < splitTime(transDuration) ? (
                      <StatHelpText className="text-secondary">
                        <StatArrow type="decrease" />
                        {combineTime(
                          splitTime(driveDuration) - splitTime(transDuration)
                        )}
                      </StatHelpText>
                    ) : (
                      <StatHelpText className="text-primary">
                        <StatArrow type="increase" />
                        {combineTime(
                          splitTime(driveDuration) - splitTime(transDuration)
                        )}
                      </StatHelpText>
                    )}
                  </Box>
                ) : (
                  <Box className="text-primary">
                    <FontAwesomeIcon icon={faCar} />
                    <StatLabel>saves</StatLabel>
                    <StatNumber>
                      {compCOs(parseFloat(transitC0) - parseFloat(carC0))}
                    </StatNumber>
                    {driveDuration &&
                      transDuration &&
                      (splitTime(driveDuration) > splitTime(transDuration) ? (
                        <StatHelpText className="text-primary">
                          <StatArrow type="increase" />
                          {combineTime(
                            splitTime(driveDuration) - splitTime(transDuration)
                          )}
                        </StatHelpText>
                      ) : (
                        <StatHelpText className="text-secondary">
                          <StatArrow type="decrease" />
                          {combineTime(
                            splitTime(driveDuration) - splitTime(transDuration)
                          )}
                        </StatHelpText>
                      ))}
                  </Box>
                ))}
            </Stat>
          </StatGroup>
        </div>
      );
    }
  }

  return (
    <div>
      {/* <CarSelection /> */}

      <Box>
        <Center>
          <HStack>
            {pollutionCar}
            {pollutionTrans}
          </HStack>
        </Center>
        {stat}
        <br />
        {creditsPost}
        <br />
        {creditsGet}
      </Box>
    </div>
  );
};

export default Compare;

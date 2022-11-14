import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Box,
  Grid,
  HStack,
  Text,
  Center,
  VStack,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleUnbalanced,
  faBicycle,
  faBus,
  faCar,
  faPersonWalking,
  faSubway,
  faCodeCompare,
  faArrowUp,
  faEquals,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Trees from "./Trees";

const Transit = ({
  route,
  chooseTransitC0,
  chooseTransMode,
  compare,
  distance,
  duration,
}) => {
  const [trans, setTrans] = useState([]);
  const [sumTrans, setSumTrans] = useState(0);
  const [transMode, setTransMode] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  useEffect(() => {
    {
      const getMeans = () => {
        let amount = [];
        let array = [];

        for (const e of route) {
          if (e.transit) {
            console.log(e.transit.line.vehicle.type);
            let means = e.transit.line.vehicle.type;
            let distance = e.distance.value / 1000;
            let meansPoll = 0;
            switch (means) {
              case "BUS":
                meansPoll = 143;
                break;
              case "HEAVY_RAIL":
                meansPoll = 6;
                break;
              case "SUBWAY":
                meansPoll = 41;
                break;
              case "TRAM":
                meansPoll = 41;
                break;
              default:
                meansPoll = 41;
            }

            let totalPoll = distance.toFixed(2) * meansPoll;
            // if (means === )
            // let means_poll = totalPoll + " " + means;

            amount.push(totalPoll);
            array.push({ [means]: totalPoll / 1000 });
          }
        }

        const result = {};

        array.forEach((basket) => {
          for (let [key, value] of Object.entries(basket)) {
            if (result[key]) {
              result[key] += value;
            } else {
              result[key] = value;
            }
          }
        });

        setTransMode(result);
        chooseTransMode(result);

        let sum = 0;
        for (const x of amount) {
          sum += x;
        }
        if (sum > 1000) {
          setSumTrans((sum / 1000).toFixed(2) + " Kg");
          chooseTransitC0((sum / 1000).toFixed(2) + " Kg");
        } else {
          setSumTrans(sum.toFixed(2) + " g");
          chooseTransitC0(sum.toFixed(2) + " g");
        }
      };
      getMeans();
    }
  }, [route, compare]);

  return (
    <Box>
      {sumTrans > 0 && (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Text>Transit</Text>
          <Text> {sumTrans}Kg CO2</Text>
          {<Text>Bus {transMode.BUS}Kg CO2</Text>}
          {transMode.TRAIN && <Text> {transMode.TRAIN}Kg CO2</Text>}
        </Grid>
      )}
      {/* {sumTrans} */}

      <Stat>
        <FontAwesomeIcon icon={faSubway} />

        <StatLabel>CO2 Produced</StatLabel>
        <StatNumber>{sumTrans}</StatNumber>
        <StatHelpText>
          {distance}
          <br />
          {duration}
        </StatHelpText>
      </Stat>
    </Box>
  );
};

export default Transit;

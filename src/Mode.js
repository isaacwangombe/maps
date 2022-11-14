import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faBus,
  faCar,
  faPersonWalking,
  faSubway,
} from "@fortawesome/free-solid-svg-icons";

const Mode = ({ chooseMode, onChoose }) => {
  const [openTab, setOpenTab] = React.useState(1);
  const data = [
    {
      num: 1,
      icon: <FontAwesomeIcon icon={faCar} />,
      value: "DRIVING",
    },

    {
      num: 2,
      icon: <FontAwesomeIcon icon={faSubway} />,
      value: "TRANSIT",
    },
    {
      num: 3,
      icon: <FontAwesomeIcon icon={faBicycle} />,
      value: "BICYCLING",
    },

    {
      num: 4,
      icon: <FontAwesomeIcon icon={faPersonWalking} />,
      value: "WALKING",
    },
  ];

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <ul
          className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row  rounded-full"
          role="tablist"
        >
          {data.map(({ icon, value, num }) => (
            <li
              className="-mb-px mr-2 last:mr-0 flex-auto text-center rounded-full tooltip  tooltip-bottom "
              key={num}
              id={value}
              data-tip={value}
              onClick={(e) => {
                chooseMode(e.currentTarget.id);
                // onChoose();
              }}
              // onClick={onChoose}
            >
              <a
                className={
                  "p-3 w-10 h-10 rounded-full leading-normal " +
                  (openTab == num
                    ? "text-white bg-red-600"
                    : "text-red-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(num);
                }}
                data-toggle="tab"
                role="tablist"
              >
                {icon}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Mode;

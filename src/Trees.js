import React, { useState } from "react";

const Trees = ({ num }) => {
  const rows = [];
  const [trees, setTrees] = useState(0);

  let daily = 24 / 365;
  let number = num / daily;

  for (let i = 0; i < number; i++) {
    rows.push(String.fromCodePoint(parseInt("1F332", 16)));
  }
  return <div className="">{rows}</div>;
};

export default Trees;

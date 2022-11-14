import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";

const Navbar = ({ setResetSignout }) => {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
    setResetSignout("done");
  };

  return (
    <div>
      {user?.displayName ? (
        <button className="btn btn-secondary" onClick={handleSignOut}>
          Logout
        </button>
      ) : null}
    </div>
  );
};
export default Navbar;

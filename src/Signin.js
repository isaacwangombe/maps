import React, { useEffect, useState } from "react";
import { GoogleButton } from "react-google-button";
import { useNavigate } from "react-router-dom";

import { UserAuth } from "./context/AuthContext";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config";
import CarSelection from "./CarSelection";

const Signin = ({ redirect }) => {
  const { googleSignIn, user } = UserAuth();
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [reset, setReset] = useState("");

  const refresh = (reset) => {
    setReset(reset);
    redirect(reset);
  };

  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      const fetch = async () => {
        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          addDoc(usersCollectionRef, {
            name: user.displayName,
            email: user.email,
          });
          console.log("yes");
        } else console.log("no");
      };
      fetch().catch(console.error);
      // navigate("/app");
    }
  }, [user]);

  return (
    <div>
      {user ? (
        <CarSelection refresh={refresh} />
      ) : (
        <div className="max-w-[240px] m-auto py-4">
          <GoogleButton onClick={handleGoogleSignIn} />
        </div>
      )}
    </div>
  );
};

export default Signin;

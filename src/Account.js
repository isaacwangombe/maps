import { useState, useEffect } from "react";
import { UserAuth } from "./context/AuthContext";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase-config";

const Account = () => {
  const { logOut, user } = UserAuth();
  const [newCar, setNewCar] = useState("");
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");

  const userRef = collection(db, "users");
  useEffect(() => {
    const getUsers = async () => {
      const q = query(userRef, where("email", "==", user.email));

      const data = await getDocs(q);
      data.forEach((doc) => {
        console.log("data", doc.id, " => ", doc.id);
        setId(doc.id);
      });
    };
    getUsers();
  }, [user]);
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const addCar = async () => {
    const userDoc = doc(db, "users", id);
    const newFields = { car: newCar };
    // await addDoc(usersCollectionRef, { car: newCar});
    await updateDoc(userDoc, newFields);
  };

  return (
    <div className="w-[300px] m-auto">
      <input
        type="text"
        placeholder="car"
        onChange={(e) => {
          setNewCar(e.target.value);
        }}
      />

      <button onClick={addCar}>Create user</button>
      <h1 className="text-center text-2xl font-bold pt-12">Account</h1>
      <div>
        <p>Welcome, {user?.displayName}</p>
      </div>
      <button onClick={handleSignOut} className="border py-2 px-5 mt-10">
        Logout
      </button>
    </div>
  );
};

export default Account;

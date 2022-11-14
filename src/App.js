import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./Signin";
import Account from "./Account";
import Home from "./index";
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "./Navbar";
import Protected from "./Protected";
import { BrowserRouter } from "react-router-dom";
import Pollution from "./CarPoll";
import Map2 from "./Map2";
import Mode from "./Mode";
import Trees from "./Trees";
import CarSelection from "./CarSelection";
import Map from "./Map";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Map2 />} />
            {/* <Route path="/" element={<CarSelection />} /> */}
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

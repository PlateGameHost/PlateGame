import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Login } from "./components/Login";
import { FirebaseContext } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import { PlateHistory } from "./components/PlateHistory";
import { CreateAccount } from "./components/CreateAccount";

function App() {
  const [authUser, setAuthUser] = useState(null);

  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    if (firebase) {
      const listener = firebase.auth.onAuthStateChanged((user) => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      //unsubscribe the listener when the component unmounts
      return () => listener();
    }
  }, [firebase]);
  const authenticated = !!authUser;

  const [idToken, setIdToken] = useState("");
  const [userID, setuserID] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
          setuserID(user.uid);
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        setIdToken("");
        setuserID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const Landing = () => {
    return <h1>dih</h1>;
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/plate-history" element={<PlateHistory />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<Landing/>}/>
      </Routes>
    </>
  );
}

export default App;

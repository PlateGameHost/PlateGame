import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Login } from "./components/Login";
import { FirebaseContext } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import { PlateHistory } from "./components/PlateHistory";
import { CreateAccount } from "./components/CreateAccount";

function App() {
  const [idToken, setIdToken] = useState("");
  const [userID, setuserID] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setLoading(true);
          const token = await user.getIdToken();
          setIdToken(token);
          setuserID(user.uid);
          console.log("current user: ", user);
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        setIdToken("");
        setuserID(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/plate-history" element={<PlateHistory uuid={userID} />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/" element={<PlateHistory uuid={userID} />} />
      </Routes>
    </>
  );
}

export default App;

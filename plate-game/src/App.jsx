import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Login } from "./pages/Login";
import { FirebaseContext } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";

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

  const [rows, setRows] = useState([
    { number: "001", date: "2026-09-09", notes: "Yay!" },
    { number: "002", date: "2026-09-15" },
    { number: "003", date: "2026-09-15", notes: "2 in 1" },
    { number: "004", date: "2026-09-20" },
  ]);

  const [sort, setSort] = useState({ column: "", ascending: true });

  function sortBy(column) {
    const ascending = sort.column === column ? !sort.ascending : true;

    setRows(
      [...rows].sort((a, b) => {
        const result = a[column].localeCompare(b[column], undefined, {
          numeric: true,
        });
        return ascending ? result : -result;
      })
    );

    setSort({ column, ascending });
  }

  return (
    <>
      <div className="box">Find History</div>

      <table className="plate-table">
        <thead>
          <tr>
            <th>
              <button onClick={() => sortBy("number")}>NUMBER</button>
            </th>
            <th>DATE</th>
            <th>NOTES</th>
            <th>IMAGE</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.number}>
              <td>{row.number}</td>
              <td>{row.date}</td>
              <td>{row.notes}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dih" element={<Landing />} />
      </Routes>
    </>
  );
}

export default App;

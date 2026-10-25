import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const CreateAccount = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uuid, setUuid] = useState(null);
  const [idToken, setIdToken] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {
    let validInput =
      emailError ||
      passwordError ||
      firstNameError ||
      lastNameError ||
      usernameError ||
      true;

    const auth = getAuth();
    console.log("running handlesubmit");
    if (validInput) {
      event.preventDefault();
      console.log("running if statement");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          fetch(apiUrl + "/add-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              general_info: {
                name: firstName + " " + lastName,
                username: username,
                email: email,
              },
              uuid: user.uid,
            }),
          });
        })
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <input
        id="email"
        type="text"
        value={email}
        onChange={handleEmailChange}
        placeholder="enter your email"
      />
      <input
        id="password"
        type="text"
        value={password}
        onChange={handlePasswordChange}
        placeholder="enter your password"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

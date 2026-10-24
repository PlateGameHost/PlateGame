import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";

export const CreateAccount = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uuid, setUuid] = useState(null);
  const [idToken, setIdToken] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async () => {
    let validInput = emailError || passwordError || firstNameError || lastNameError || usernameError;

    const auth = getAuth()

    if (validInput) {
      event.preventDefault();
      firebase
      .createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      const user = userCredential.user
      fetch("/add-user", {
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
      })}).then(() => {
        navigate("/login");
      }).catch((error) => {
        setError(error);
      })
      
    }
  };

  return (<div>
    <input id="email" type="text" value={email} onChange={handleEmailChange} placeholder="enter your email"/>
  <input id="password" type="text" value={password} onChange={handlePasswordChange} placeholder="enter your password"/>
  <button id="create" onClick={handleSubmit}>Create Account</button>
  </div>);
};

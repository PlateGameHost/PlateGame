import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const CreateAccount = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [uuid, setUuid] = useState(null);

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

  const handleSubmit = async () => {
    if (login?.email) {
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
          uuid: username,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load user profile");
          return res.json();
        })
        .then((data) => {
          if (data) {
            setProfileInfo({
              resume_data: data.resume_data,
              contact_info: data.contact_info,
            });
            if (data.resume_data) {
              const userSkills = data.resume_data.skills || "";
              const userCoursework =
                data.resume_data.education?.coursework || "";
              const combinedKeywords = [userSkills, userCoursework]
                .filter(Boolean)
                .join(", ");
              setResumeSkills(combinedKeywords);
            }
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return <div>CreateAccount</div>;
};

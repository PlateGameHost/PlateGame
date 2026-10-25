import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate("/plate-history")}>Plate history</button>
      <button onClick={() => navigate("/plate-history")}>Plate history</button>
    </div>
  );
};

import React, { useEffect, useState } from "react";

export const LeagueMemberPlateDisplay = ({ uuid }) => {
  const [currentPlate, setCurrentPlate] = useState();
  const [displayName, setDisplayName] = useState();
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await fetch(apiUrl + `/get-user-profile?uuid=${uuid}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
      } else {
        const data = await res.json();
        if (data) {
          setCurrentPlate(
            Number(data.plates[data.plates.length - 1].plate_num) + 1,
          );
          setDisplayName(data.general_info.name);
        }
        console.log(data);
      }
    };
    getUserInfo();
  }, []);

  return (
    <div>
      {displayName}: {currentPlate}
    </div>
  );
};

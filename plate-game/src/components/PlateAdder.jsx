import React, { useState, useEffect } from "react";

export const PlateAdder = ({
  uuid,
  currentPlate,
  previousPlateDate,
  rows,
  setRows,
}) => {
  const [plate, setPlate] = useState({});
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const currentDate = new Date();
  const maxDateString = currentDate.toISOString().split("T")[0];

  const [date, setDate] = useState(currentDate);
  const [notes, setNotes] = useState("");
  const [img, setImg] = useState(null);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleImgChange = (event) => {
    setImg(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const plate_info = {
        plate_num: currentPlate,
        date: date,
        notes: notes,
        img: setImg,
      };
      const res = await fetch(apiUrl + "/plate-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plate_info: plate_info,
          uuid: uuid,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
      } else {
        const data = await res.json();
        setRows([...rows, plate_info]);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input
        id="plate_num"
        type="text"
        value={currentPlate}
        placeholder="plate number"
        disabled={true}
      />
      <input
        id="date"
        type="date"
        value={date}
        onChange={handleDateChange}
        max={maxDateString}
        min={previousPlateDate}
        placeholder="enter the date the plate was found"
      />
      <input
        id="notes"
        type="text"
        value={notes}
        onChange={handleNotesChange}
        placeholder="notes"
      />
      <input
        id="img"
        type="file"
        value={img}
        onChange={handleImgChange}
        placeholder="image"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

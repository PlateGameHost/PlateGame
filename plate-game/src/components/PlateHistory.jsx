import { useState, useEffect } from "react";
import { PlateAdder } from "./PlateAdder";
import { LeagueMemberPlateDisplay } from "./LeagueMemberPlateDisplay";

export const PlateHistory = ({ uuid }) => {
  const [rows, setRows] = useState([]);
  const [previousPlateDate, setPreviousPlateDate] = useState();

  const [sort, setSort] = useState({ column: "", ascending: true });

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getPlateHistory = async () => {
      const res = await fetch(apiUrl + `/get-full-plate-history?uuid=${uuid}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
      } else {
        const data = await res.json();
        setRows(data);
        if (data) {
          setPreviousPlateDate(data[data?.length - 1].date);
        }
        console.log(data);
      }
    };
    getPlateHistory();
  }, []);

  const constructPlateNumber = (plateNum) => {
    if (plateNum < 10) {
      return `00${plateNum}`;
    } else if (plateNum < 100) {
      return `0${plateNum}`;
    } else {
      return plateNum;
    }
  };

  function sortBy(column) {
    const ascending = sort.column === column ? !sort.ascending : true;

    setRows(
      [...rows].sort((a, b) => {
        const result = a[column].localeCompare(b[column], undefined, {
          numeric: true,
        });
        return ascending ? result : -result;
      }),
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
          {rows?.map((row) => (
            <tr key={row.plate_num}>
              <td>{row.plate_num}</td>
              <td>{row.date}</td>
              <td>{row.notes}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <PlateAdder
        uuid={uuid}
        currentPlate={constructPlateNumber((rows?.length || 0) + 1)}
        previousPlateDate={previousPlateDate}
        rows={rows}
        setRows={setRows}
      />

      <LeagueMemberPlateDisplay />
    </>
  );
};

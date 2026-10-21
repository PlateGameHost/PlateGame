import React from "react";

export const PlateHistory = () => {
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
    </>
  );
};

import React from "react";
import { format, parseISO, isValid } from "date-fns";

const GenericTable = ({
  data,
  onEdit,
  onDelete,
  onDetails,
  idField = "id",
  columns,
}) => {
  if (!data || !data.length) return <div>Nema podataka</div>;

  const cols = columns && columns.length ? columns : Object.keys(data[0]);

  return (
    <table className="w-full max-w-5xl text-center bg-white rounded-lg shadow-md overflow-hidden">
      <thead className="bg-teal-500 text-white">
        <tr>
          {cols.map((col) => (
            <th key={col} className="p-2">
              {col}
            </th>
          ))}
          <th className="p-2">akcije</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row[idField]}
            className="border-b border-teal-500 hover:bg-gray-50"
          >
            {cols.map((col) => (
              <td key={col} className="p-2">
                {(() => {
                  const d = parseISO(row[col] ?? "");
                  return isValid(d)
                    ? format(d, "MM / dd / yyyy HH:mm")
                    : String(row[col] ?? "");
                })()}
              </td>
            ))}
            <td className="p-2 flex my-2 gap-2 justify-center items-center">
              <button
                onClick={() => onDetails && onDetails(row)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Detalji
              </button>
              <button
                onClick={() => onEdit && onEdit(row)}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Izmeni
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Da li ste sigurni da želite obrisati stavku?",
                    )
                  ) {
                    onDelete && onDelete(row[idField]);
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Obriši
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;

import { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import GenericForm from "../../components/genericForm";

const ProcedureIstorije = ({ parentItem, onSave, parentMode, opts = [] }) => {
  const [data, setData] = useState(parentItem.procedure || []);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  useEffect(() => {
    setData(parentItem.procedure || []);
  }, [parentItem.procedure]);

  const idField = "sifraprocedure";

  const fieldConfig = {
    sifraprocedure: { type: "select", options: opts },
  };

  const handleCreate = async (novaProcedura) => {
    const osvezenNiz = [...data, { ...novaProcedura }];

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const handleDelete = async (procedura) => {
    const osvezenNiz = data.filter((s) => s.sifraprocedure !== procedura);

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const isParentViewOnly = parentMode === "view";

  return (
    <div className="flex flex-col items-center mb-20 w-full">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">
          Procedure
        </h3>

        <GenericTable
          data={data}
          idField={idField}
          columns={["sifraprocedure", "naziv"]}
          fieldConfig={fieldConfig}
          onDelete={(row) => {
            setSelectedItem(row);
            handleDelete(row);
          }}
          actions={{
            canView: false,
            canEdit: false,
            canDelete: !isParentViewOnly,
          }}
        />

        {!showForm && !isParentViewOnly && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedItem({
                  sifraprocedure: null,
                });
                setFormMode("create");
                setShowForm(true);
              }}
              className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Dodaj proceduru
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="w-full max-w-4xl">
          <GenericForm
            item={selectedItem}
            template={["sifraprocedure"]}
            fieldConfig={fieldConfig}
            idField={idField}
            mode={formMode}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
          />
        </div>
      )}
    </div>
  );
};

export default ProcedureIstorije;

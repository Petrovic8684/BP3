import { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import GenericForm from "../../components/genericForm";

const DijagnozeIstorije = ({ parentItem, onSave, parentMode, opts = [] }) => {
  const [data, setData] = useState(parentItem.dijagnoze || []);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  useEffect(() => {
    setData(parentItem.dijagnoze || []);
  }, [parentItem.dijagnoze]);

  const idField = "sifradijagnoze";
  const fieldConfig = {
    sifradijagnoze: { type: "select", options: opts },
  };

  const handleCreate = async (novaDijagnoza) => {
    const osvezenNiz = [...data, { ...novaDijagnoza }];

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const handleDelete = async (dijagnoza) => {
    const osvezenNiz = data.filter((s) => s.sifradijagnoze !== dijagnoza);

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const isParentViewOnly = parentMode === "view";

  return (
    <div className="flex flex-col items-center mb-20 w-full">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">
          Prateće dijagnoze
        </h3>

        <GenericTable
          data={data}
          idField={idField}
          columns={["sifradijagnoze", "naziv", "opis"]}
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
                  sifradijagnoze: null,
                });
                setFormMode("create");
                setShowForm(true);
              }}
              className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Dodaj dijagnozu
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="w-full max-w-4xl">
          <GenericForm
            item={selectedItem}
            template={["sifradijagnoze"]}
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

export default DijagnozeIstorije;

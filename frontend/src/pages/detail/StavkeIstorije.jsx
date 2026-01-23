import { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import GenericForm from "../../components/genericForm";
import { api } from "../../lib/api";

const StavkeIstorije = ({ parentItem, onSave, parentMode, opts = [] }) => {
  const [data, setData] = useState(parentItem.stavke || []);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  useEffect(() => {
    setData(parentItem.stavke || []);
  }, [parentItem.stavke]);

  const idField = "brstavkeistorije";
  const fieldConfig = {
    jkl: { type: "select", options: opts },
    datumvreme: { type: "datetime" },
    toknalazi: { type: "textarea" },
  };

  const handleCreate = async (novaStavka) => {
    const noviBr =
      data.length > 0
        ? Math.max(...data.map((s) => Number(s.brstavkeistorije))) + 1
        : 1;
    const osvezenNiz = [...data, { ...novaStavka, brstavkeistorije: noviBr }];

    const uspeh = await onSave(osvezenNiz);
    if (uspeh && uspeh.success) setShowForm(false);

    return uspeh;
  };

  const handleUpdate = async (id, izmenjenaStavka) => {
    const osvezenNiz = data.map((s) =>
      s.brstavkeistorije === id ? izmenjenaStavka : s,
    );

    const uspeh = await onSave(osvezenNiz);
    if (uspeh && uspeh.success) setShowForm(false);

    return uspeh;
  };

  const handleDelete = async (stavka) => {
    const osvezenNiz = data.filter((s) => s.brstavkeistorije !== stavka);

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const isParentViewOnly = parentMode === "view";

  return (
    <div className="flex flex-col items-center mb-20 w-full">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">
          Stavke istorije
        </h3>

        <GenericTable
          data={data}
          idField={idField}
          columns={["brstavkeistorije", "jkl", "datumvreme", "doza"]}
          fieldConfig={fieldConfig}
          onEdit={(row) => {
            setSelectedItem(row);
            setFormMode("edit");
            setShowForm(true);
          }}
          onDelete={(row) => {
            setSelectedItem(row);
            setShowForm(false);
            handleDelete(row);
          }}
          onDetails={(row) => {
            setSelectedItem(row);
            setFormMode("view");
            setShowForm(true);
          }}
          actions={{
            canView: true,
            canEdit: !isParentViewOnly,
            canDelete: !isParentViewOnly,
          }}
        />

        {!showForm && !isParentViewOnly && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedItem({
                  brstavkeistorije: null,
                  jkl: null,
                  datumvreme: null,
                  toknalazi: null,
                  doza: null,
                });
                setFormMode("create");
                setShowForm(true);
              }}
              className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
            >
              Dodaj stavku
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="w-full max-w-4xl">
          <GenericForm
            item={selectedItem}
            template={[
              "brstavkeistorije",
              "jkl",
              "datumvreme",
              "doza",
              "toknalazi",
            ]}
            fieldConfig={fieldConfig}
            idField={idField}
            mode={formMode}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default StavkeIstorije;

import { useState, useEffect } from "react";
import GenericTable from "../../components/genericTable";
import GenericForm from "../../components/genericForm";

const StavkeNalogaZaDavanjeInjekcija = ({
  parentItem,
  onSave,
  parentMode,
  opts = [],
  isDoktor,
}) => {
  const [data, setData] = useState(parentItem.stavke || []);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  useEffect(() => {
    setData(parentItem.stavke || []);
  }, [parentItem.stavke]);

  const idField = "brstavke";
  const fieldConfig = {
    jkl: {
      readOnly: !isDoktor,
      type: "select",
      options: opts,
    },
    doza: { readOnly: true },
    propisanoampula: { readOnly: !isDoktor },
    datoampula: { readOnly: isDoktor },
  };

  const handleCreate = async (novaStavka) => {
    const noviBr =
      data.length > 0
        ? Math.max(...data.map((s) => Number(s.brstavke))) + 1
        : 1;
    const osvezenNiz = [
      ...data,
      { ...novaStavka, brstavke: noviBr, doza: null, datoampula: null },
    ];

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const handleUpdate = async (id, izmenjenaStavka) => {
    const osvezenNiz = data.map((s) => {
      if (s.brstavke === id) {
        return {
          ...izmenjenaStavka,
          doza: null,
          datoampula: isDoktor ? null : izmenjenaStavka.datoampula,
        };
      } else {
        return {
          ...s,
          doza: null,
          datoampula: isDoktor ? null : s.datoampula,
        };
      }
    });

    const uspeh = await onSave(osvezenNiz);
    if (uspeh) setShowForm(false);

    return uspeh;
  };

  const isParentViewOnly = parentMode === "view";

  return (
    <div className="flex flex-col items-center mb-20 w-full">
      <div className="w-full max-w-4xl">
        <h3 className="text-lg text-gray-700 font-bold mb-4 text-center">
          Stavke naloga
        </h3>

        <GenericTable
          data={data}
          idField={idField}
          columns={["brstavke", "jkl", "propisanoampula", "datoampula", "doza"]}
          fieldConfig={fieldConfig}
          onEdit={(row) => {
            setSelectedItem(row);
            setFormMode("edit");
            setShowForm(true);
          }}
          onDetails={(row) => {
            setSelectedItem(row);
            setFormMode("view");
            setShowForm(true);
          }}
          actions={{
            canView: true,
            canEdit: !isParentViewOnly,
            canDelete: false,
          }}
        />

        {!showForm && !isParentViewOnly && isDoktor && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                setSelectedItem({
                  brstavke: null,
                  jkl: null,
                  propisanoampula: null,
                  datoampula: null,
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
              "brstavke",
              "jkl",
              "propisanoampula",
              "datoampula",
              "doza",
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

export default StavkeNalogaZaDavanjeInjekcija;

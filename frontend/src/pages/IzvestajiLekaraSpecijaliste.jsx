import { useState, useEffect } from "react";
import Logo from "../components/logo";
import Odjava from "../components/odjava";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";

const IzvestajiLekaraSpecijaliste = () => {
  const korisnik = vratiKorisnika();
  const endpoint = "/izvestajlekaraspecijaliste";
  const idField = "sifraizvestaja";

  const {
    data: izvestaji,
    loading,
    greska,
    create: createHook,
    update: updateHook,
    remove: removeHook,
  } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [uputiOptions, setUputiOptions] = useState([]);
  const [dijagnozaOptions, setDijagnozaOptions] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        const [uRes, dRes] = await Promise.all([
          api.get("/uputzaambulantnospecijalistickipregled"),
          api.get("/dijagnoza"),
        ]);

        if (!mounted) return;

        const uOpts =
          uRes?.data?.success && Array.isArray(uRes.data.data)
            ? uRes.data.data.map((u) => ({
                value: u.sifrauputaas,
                label: `${u.sifrauputaas}`,
              }))
            : [];

        const dOpts =
          dRes?.data?.success && Array.isArray(dRes.data.data)
            ? dRes.data.data.map((d) => ({
                value: d.sifradijagnoze,
                label: `${d.sifradijagnoze} | ${d.naziv}`,
              }))
            : [];

        setUputiOptions(uOpts);
        setDijagnozaOptions(dOpts);
      } catch (err) {
        console.error("Greška pri dohvatu uputa/dijagnoza:", err);
      } finally {
        if (mounted) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  const defaultTemplate = {
    sifraizvestaja: "",
    datumvreme: "",
    brprotokola: "",
    nalazmisljenje: "",
    sifrauputaas: "",
    sifradijagnoze: "",
  };

  const templateKeys =
    izvestaji && izvestaji.length > 0
      ? Object.keys(izvestaji[0])
      : Object.keys(defaultTemplate);

  const fieldConfig = {
    sifrauputaas: { type: "select", options: uputiOptions },
    sifradijagnoze: { type: "select", options: dijagnozaOptions },
    nalazmisljenje: { type: "textarea" },
  };

  const create = async (item) => await createHook(item);
  const update = async (id, item) => await updateHook(id, item);
  const remove = async (id) => await removeHook(id);

  const handleEdit = (row) => {
    const full = izvestaji.find((i) => i[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = izvestaji.find((i) => i[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("view");
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormMode("create");
    setShowForm(true);
  };

  const tableColumns = [
    "sifraizvestaja",
    "datumvreme",
    "brprotokola",
    "sifrauputaas",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Odjava korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Izveštaji lekara specijaliste
        </h1>

        {loading || metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={izvestaji || []}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onDelete={remove}
            idField={idField}
            columns={tableColumns}
          />
        )}

        {greska && (
          <div className="text-red-500 mt-6 text-center">{greska}</div>
        )}

        {showForm && (
          <GenericForm
            item={selectedItem}
            template={templateKeys}
            fieldConfig={fieldConfig}
            idField={idField}
            mode={formMode}
            onClose={() => {
              setSelectedItem(null);
              setShowForm(false);
            }}
            onCreate={create}
            onUpdate={update}
            onDelete={remove}
          />
        )}

        {!showForm && (
          <button
            onClick={handleCreateOpen}
            className="mt-6 px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Dodaj izveštaj
          </button>
        )}
      </main>
    </div>
  );
};

export default IzvestajiLekaraSpecijaliste;

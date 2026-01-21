import { useState, useEffect } from "react";
import Logo from "../components/logo";
import Odjava from "../components/odjava";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";

const UputiZaStacionarnoLecenje = () => {
  const korisnik = vratiKorisnika();
  const endpoint = "/uputzastacionarnolecenje";
  const idField = "sifrauputasl";

  const {
    data: uputi,
    loading,
    greska,
    create: createHook,
    update: updateHook,
    remove: removeHook,
  } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [pacijentOptions, setPacijentOptions] = useState([]);
  const [dijagnozaOptions, setDijagnozaOptions] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        const [pRes, dRes] = await Promise.all([
          api.get("/registrovanipacijent"),
          api.get("/dijagnoza"),
        ]);

        if (!mounted) return;

        const pacOpts =
          pRes?.data?.success && Array.isArray(pRes.data.data)
            ? pRes.data.data.map((p) => ({
                value: p.jmbg,
                label: `${p.jmbg} | ${p.prezimeime}`,
              }))
            : [];

        const dijOpts =
          dRes?.data?.success && Array.isArray(dRes.data.data)
            ? dRes.data.data.map((d) => ({
                value: d.sifradijagnoze,
                label: `${d.sifradijagnoze} | ${d.naziv}`,
              }))
            : [];

        setPacijentOptions(pacOpts);
        setDijagnozaOptions(dijOpts);
      } catch (err) {
        console.error("Greška pri dohvatu pacijenata/dijagnoza:", err);
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
    sifrauputasl: "",
    datum: "",
    brprotokola: "",
    jmbg: "",
    sifradijagnoze: "",
  };

  const fieldConfig = {
    jmbg: { type: "select", options: pacijentOptions },
    sifradijagnoze: { type: "select", options: dijagnozaOptions },
  };

  const create = async (item) => {
    const payload = { ...item };
    return await createHook(payload);
  };

  const update = async (id, item) => {
    const payload = { ...item };
    return await updateHook(id, payload);
  };

  const remove = async (id) => {
    return await removeHook(id);
  };

  const handleEdit = (row) => {
    const full = uputi.find((u) => u[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = uputi.find((u) => u[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("view");
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormMode("create");
    setShowForm(true);
  };

  const tableColumns = ["sifrauputasl", "datum", "brprotokola"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Odjava korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Uputi za stacionarno lečenje
        </h1>

        {loading || metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={uputi || []}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onDelete={(id) => remove(id)}
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
            template={Object.keys(defaultTemplate)}
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
            Dodaj uput
          </button>
        )}
      </main>
    </div>
  );
};

export default UputiZaStacionarnoLecenje;

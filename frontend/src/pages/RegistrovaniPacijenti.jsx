import { useState, useEffect } from "react";
import Logo from "../components/logo";
import Header from "../components/header";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";

const RegistrovaniPacijenti = () => {
  const korisnik = vratiKorisnika();
  const endpoint = "/registrovanipacijent";
  const idField = "jmbg";

  const {
    data: pacijenti,
    loading,
    greska,
    create: createHook,
    update: updateHook,
    remove: removeHook,
    fetchData: fetchData,
  } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [doktorOptions, setDoktorOptions] = useState([]);
  const [mestoOptions, setMestoOptions] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        const [dRes, mRes] = await Promise.all([
          api.get("/doktormedicine"),
          api.get("/mesto"),
        ]);

        if (mounted) {
          const doks =
            dRes?.data?.success && Array.isArray(dRes.data.data)
              ? dRes.data.data.map((d) => ({
                  value: d.brlicence,
                  label: `${d.brlicence} | ${d.prezimeime}`,
                }))
              : [];

          const mest =
            mRes?.data?.success && Array.isArray(mRes.data.data)
              ? mRes.data.data.map((m) => ({
                  value: m.ppt,
                  label: `${m.ppt} | ${m.naziv}`,
                }))
              : [];

          setDoktorOptions(doks);
          setMestoOptions(mest);
        }
      } catch (err) {
        console.error("Greška pri dohvatu doktora/mesta:", err);
      } finally {
        if (mounted) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      fetchData(q);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  const defaultTemplate = {
    jmbg: null,
    prezimeime: null,
    pol: null,
    imeroditelja: null,
    datumrodjenja: null,
    posao: null,
    lbo: null,
    brknjizice: null,
    adresa: null,
    ppt: null,
    brlicencetehnicardodao: null,
    brlicenceizbranidoktor: null,
  };

  const templateKeys =
    pacijenti && pacijenti.length > 0
      ? Object.keys(pacijenti[0])
      : Object.keys(defaultTemplate);

  const fieldConfig = {
    brlicencetehnicardodao: { type: "hidden" },
    pol: {
      type: "select",
      options: [
        { value: "M", label: "M" },
        { value: "Z", label: "Z" },
      ],
    },
    brlicenceizbranidoktor: { type: "select", options: doktorOptions },
    ppt: { type: "select", options: mestoOptions },
    datumrodjenja: { type: "date" },
  };

  const create = async (item) => {
    const payload = {
      ...item,
      brlicencetehnicardodao:
        korisnik?.brlicence || item.brlicencetehnicardodao,
    };
    return await createHook(payload);
  };

  const update = async (id, item) => {
    const payload = {
      ...item,
      brlicencetehnicardodao:
        korisnik?.brlicence || item.brlicencetehnicardodao,
    };
    return await updateHook(id, payload);
  };

  const remove = async (id) => {
    return await removeHook(id);
  };

  const handleEdit = (row) => {
    const full = pacijenti.find((p) => p[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = pacijenti.find((p) => p[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("view");
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormMode("create");
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Registrovani pacijenti
        </h1>

        {metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Pretraga po prezimenu i imenu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 px-4 py-2 border rounded w-full max-w-md"
            />

            {loading ? (
              <div className="text-center">Učitavanje...</div>
            ) : (
              <GenericTable
                data={pacijenti || []}
                onEdit={handleEdit}
                onDetails={handleDetails}
                onDelete={(id) => remove(id)}
                idField={idField}
                columns={["jmbg", "prezimeime", "lbo", "brknjizice"]}
                fieldConfig={fieldConfig}
              />
            )}
          </>
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
            Dodaj pacijenta
          </button>
        )}
      </main>
    </div>
  );
};

export default RegistrovaniPacijenti;

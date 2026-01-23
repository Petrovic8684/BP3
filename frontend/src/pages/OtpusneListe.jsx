import { useState, useEffect } from "react";
import Logo from "../components/logo";
import Header from "../components/header";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";

const OtpusneListe = () => {
  const korisnik = vratiKorisnika();
  const endpoint = "/otpusnalista";
  const idField = "sifraotpustneliste";

  const { data, loading, greska, create, update, remove } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [brojistorijeOptions, setBrojistorijeOptions] = useState([]);
  const [sifradijagnozeOptions, setSifradijagnozeOptions] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);

        const [istorijaRes, dijagnozaRes] = await Promise.all([
          api.get("/istorijabolesti?samoZatvorene=true"),
          api.get("/dijagnoza"),
        ]);

        if (!mounted) return;

        const brojistorijeOpts =
          istorijaRes?.data?.success && Array.isArray(istorijaRes.data.data)
            ? istorijaRes.data.data.map((b) => ({
                value: b.brojistorije,
                label: b.brojistorije,
              }))
            : [];

        const sifradijagnozeOpts =
          dijagnozaRes?.data?.success && Array.isArray(dijagnozaRes.data.data)
            ? dijagnozaRes.data.data.map((d) => ({
                value: d.sifradijagnoze,
                label: `${d.sifradijagnoze} | ${d.naziv}`,
              }))
            : [];

        setBrojistorijeOptions(brojistorijeOpts);
        setSifradijagnozeOptions(sifradijagnozeOpts);
      } catch (err) {
        console.error("Greška pri učitavanju meta podataka:", err);
      } finally {
        if (mounted) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => (mounted = false);
  }, []);

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  const templateKeys =
    data && data.length > 0
      ? Object.keys(data[0])
      : [
          "sifraotpustneliste",
          "predlog",
          "epikriza",
          "datumvreme",
          "lecenod",
          "lecendo",
          "brojistorije",
          "sifradijagnozekonacna",
        ];

  const fieldConfig = {
    predlog: { type: "textarea" },
    epikriza: { type: "textarea" },
    brojistorije: { type: "select", options: brojistorijeOptions },
    sifradijagnozekonacna: { type: "select", options: sifradijagnozeOptions },
    jmbg: { readOnly: true },
    datumvreme: { type: "datetime" },
    lecenod: { type: "date" },
    lecendo: { type: "date" },
  };

  const handleEdit = (row) => {
    const full = data.find((d) => d[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = data.find((d) => d[idField] === row[idField]) || row;
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
    "sifraotpustneliste",
    "datumvreme",
    "lecenod",
    "lecendo",
    "brojistorije",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Otpusne liste
        </h1>

        {loading || metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={data || []}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onDelete={remove}
            idField={idField}
            columns={tableColumns}
            fieldConfig={fieldConfig}
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
            Dodaj otpusnu listu
          </button>
        )}
      </main>
    </div>
  );
};

export default OtpusneListe;

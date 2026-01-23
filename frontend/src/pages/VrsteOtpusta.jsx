import { useState, useEffect, useMemo, useCallback } from "react";
import Logo from "../components/logo";
import Header from "../components/header";
import vratiKorisnika from "../lib/vratiKorisnika";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";

const VrsteOtpusta = () => {
  const korisnik = vratiKorisnika();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const idField = "naziv";

  const formTemplate = useMemo(() => ["naziv"], []);
  const formConfig = useMemo(() => ({}), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/vrstaotpusta");
      if (res.data.success) {
        const formattedData = res.data.data.map((item) => ({ naziv: item }));
        setData(formattedData);
      }
    } catch (err) {
      setGreska("Greška pri učitavanju podataka.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async (newData) => {
    try {
      const vrednosti = newData.map((item) => item.naziv);
      await api.put("/vrstaotpusta", { vrednosti });
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setGreska("Greška pri ažuriranju servera.");
    }
  };

  const handleCreate = async (formData) => {
    const novaVrednost = formData.naziv?.trim();
    if (!novaVrednost) return;

    const exists = data.find((d) => d.naziv === novaVrednost);
    if (exists) {
      alert("Ova vrsta već postoji.");
      return;
    }

    await handleSync([...data, { naziv: novaVrednost }]);
    return { success: true };
  };

  const handleRemove = async (row) => {
    const idZaBrisanje = typeof row === "string" ? row : row.naziv;
    const newData = data.filter((item) => item.naziv !== idZaBrisanje);
    await handleSync(newData);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setFormMode("create");
    setShowForm(true);
  };

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />
      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Vrste otpusta
        </h1>

        {loading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={data}
            onDelete={handleRemove}
            idField={idField}
            columns={["naziv"]}
            actions={{ canView: false, canEdit: false, canDelete: true }}
          />
        )}

        {greska && (
          <div className="text-red-500 mt-6 text-center">{greska}</div>
        )}

        {showForm && (
          <GenericForm
            item={selectedItem}
            template={formTemplate}
            fieldConfig={formConfig}
            idField={idField}
            mode={formMode}
            onClose={() => setShowForm(false)}
            onCreate={handleCreate}
          />
        )}

        {!showForm && (
          <button
            onClick={handleCreateOpen}
            className="mt-6 px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Dodaj vrstu otpusta
          </button>
        )}
      </main>
    </div>
  );
};

export default VrsteOtpusta;

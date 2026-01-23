import { useState, useEffect } from "react";
import Header from "../components/header";
import Logo from "../components/logo";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";
import StavkeNalogaZaDavanjeInjekcija from "./detail/StavkeNalogaZaDavanjeInjekcija";

const NaloziZaDavanjeInjekcija = () => {
  const korisnik = vratiKorisnika();
  const isDoktor = korisnik.uloga === "D";
  const endpoint = "/nalogzadavanjeinjekcija";
  const idField = "sifranalogainj";

  const {
    data: nalozi,
    loading,
    greska,
    create: createHook,
    update: updateHook,
    remove: removeHook,
  } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [uputOptions, setUputOptions] = useState([]);
  const [lekOptions, setLekOptions] = useState([]);

  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);

        const lekRes = await api.get(
          "/lek?forma=FL007&forma=FL008&forma=FL009",
        );

        if (!mounted) return;

        const lekOpts =
          lekRes?.data?.success && Array.isArray(lekRes.data.data)
            ? lekRes.data.data.map((u) => ({
                value: u.jkl,
                label: `${u.jkl} | ${u.naziv}`,
              }))
            : [];

        setLekOptions(lekOpts);

        if (!isDoktor) return;

        const uputRes = await api.get("/uputzastacionarnolecenje");

        if (!mounted) return;

        const uputOpts =
          uputRes?.data?.success && Array.isArray(uputRes.data.data)
            ? uputRes.data.data.map((u) => ({
                value: u.sifrauputasl,
                label: u.sifrauputasl,
              }))
            : [];

        setUputOptions(uputOpts);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => (mounted = false);
  }, [isDoktor]);

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  const defaultTemplate = {
    sifranalogainj: null,
    brprotokola: null,
    sifrauputasl: null,
    brlicenceizvrsio: null,
  };

  const templateKeys =
    nalozi && nalozi.length > 0
      ? Object.keys(defaultTemplate)
      : Object.keys(defaultTemplate);

  const fieldConfig = {
    sifrauputasl: {
      type: isDoktor ? "select" : null,
      readOnly: !isDoktor,
      options: uputOptions,
    },
    brlicenceizvrsio: {
      readOnly: true,
    },
    brprotokola: {
      readOnly: !isDoktor,
    },
  };

  const create = async (item) => {
    const payload = {
      sifranalogainj: item.sifranalogainj,
      brprotokola: item.brprotokola,
      sifrauputasl: item.sifrauputasl,
      stavke: (item.stavke || []).map((s) => ({
        brstavke: s.brstavke,
        jkl: s.jkl,
        propisanoampula: Number(s.propisanoampula),
      })),
    };

    return await createHook(payload);
  };

  const update = async (id, item) => {
    const payload = {
      sifrauputasl: item.sifrauputasl,
      brprotokola: item.brprotokola,
      stavke: (item.stavke || []).map((s) => ({
        brstavke: s.brstavke,
        jkl: s.jkl,
        datoampula:
          s.datoampula !== undefined ? Number(s.datoampula) : undefined,
      })),
    };

    return await updateHook(id, payload);
  };

  const remove = async (id) => await removeHook(id);

  const handleEdit = (row) => {
    const full = nalozi.find((n) => n[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = nalozi.find((n) => n[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("view");
    setShowForm(true);
  };

  const handleCreateOpen = () => {
    setSelectedItem({
      ...defaultTemplate,
      stavke: [],
    });
    setFormMode("create");
    setShowForm(true);
  };

  const handleStavkeUpdate = async (noveStavke) => {
    const payload = {
      ...selectedItem,
      ...(!isDoktor && { brlicenceizvrsio: korisnik.brlicence }),
      stavke: noveStavke,
    };

    const res = await updateHook(selectedItem[idField], payload);

    if (res && res.success) {
      setSelectedItem(res.data.data);
    }

    return res;
  };

  const tableColumns = ["sifranalogainj", "brprotokola", "sifrauputasl"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />

      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />

        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Nalozi za davanje injekcija
        </h1>

        {loading || metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={nalozi || []}
            onEdit={handleEdit}
            onDetails={handleDetails}
            onDelete={remove}
            idField={idField}
            columns={tableColumns}
            fieldConfig={fieldConfig}
            actions={{ canDelete: isDoktor, canEdit: true, canView: true }}
          />
        )}

        {greska && (
          <div className="text-red-500 mt-6 text-center">{greska}</div>
        )}

        {showForm && selectedItem && (
          <div className="w-full max-w-4xl">
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
            />

            <StavkeNalogaZaDavanjeInjekcija
              parentItem={selectedItem}
              onSave={handleStavkeUpdate}
              parentMode={formMode}
              opts={lekOptions}
              isDoktor={isDoktor}
            />
          </div>
        )}

        {!showForm && isDoktor && (
          <button
            onClick={handleCreateOpen}
            className="mt-6 px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Dodaj nalog
          </button>
        )}
      </main>
    </div>
  );
};

export default NaloziZaDavanjeInjekcija;

import { useState, useEffect } from "react";
import Header from "../components/header";
import Logo from "../components/logo";
import vratiKorisnika from "../lib/vratiKorisnika";
import { useCRUD } from "../hooks/useCRUD";
import GenericTable from "../components/genericTable";
import GenericForm from "../components/genericForm";
import { api } from "../lib/api";
import StavkeIstorije from "./detail/StavkeIstorije";
import DijagnozeIstorije from "./detail/DijagnozeIstorije";
import ProcedureIstorije from "./detail/ProcedureIstorije";

const IstorijeBolesti = () => {
  const korisnik = vratiKorisnika();
  const endpoint = "/istorijabolesti";
  const idField = "brojistorije";

  const {
    data: istorije,
    loading,
    greska,
    create: createHook,
    update: updateHook,
    remove: removeHook,
  } = useCRUD(endpoint);

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formMode, setFormMode] = useState("view");

  const [dijagnozeOptions, setDijagnozeOptions] = useState([]);
  const [odeljenjaOptions, setOdeljenjaOptions] = useState([]);
  const [vrstaOtpustaOptions, setVrstaOtpustaOptions] = useState([]);
  const [uputiOptions, setUputiOptions] = useState([]);
  const [povredeOptions, setPovredeOptions] = useState([]);
  const [procedureOptions, setProcedureOptions] = useState([]);
  const [lekOptions, setLekOptions] = useState([]);

  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);

        const [dRes, oRes, vRes, uRes, pRes, prRes, lekRes] = await Promise.all(
          [
            api.get("/dijagnoza"),
            api.get("/odeljenje"),
            api.get("/vrstaotpusta"),
            api.get("/uputzastacionarnolecenje"),
            api.get("/uzrokpovrede"),
            api.get("/procedura"),
            api.get("/lek"),
          ],
        );

        if (!mounted) return;

        const dOpts =
          dRes?.data?.success && Array.isArray(dRes.data.data)
            ? dRes.data.data.map((d) => ({
                value: d.sifradijagnoze,
                label: `${d.sifradijagnoze} | ${d.naziv}`,
              }))
            : [];

        const oOpts =
          oRes?.data?.success && Array.isArray(oRes.data.data)
            ? oRes.data.data.map((o) => ({
                value: o.sifraodeljenja,
                label: `${o.sifraodeljenja} | ${o.naziv}`,
              }))
            : [];

        const vOpts =
          vRes?.data?.success && Array.isArray(vRes.data.data)
            ? vRes.data.data.map((v) => ({
                value: v,
                label: v,
              }))
            : [];

        const uOpts =
          uRes?.data?.success && Array.isArray(uRes.data.data)
            ? uRes.data.data.map((u) => ({
                value: u.sifrauputasl,
                label: u.sifrauputasl,
              }))
            : [];

        const pOpts =
          pRes?.data?.success && Array.isArray(pRes.data.data)
            ? pRes.data.data.map((p) => ({
                value: p.sifrapovrede,
                label: `${p.sifrapovrede} | ${p.naziv}`,
              }))
            : [];

        const prOpts =
          prRes?.data?.success && Array.isArray(prRes.data.data)
            ? prRes.data.data.map((p) => ({
                value: p.sifraprocedure,
                label: `${p.sifraprocedure} | ${p.naziv}`,
              }))
            : [];

        const lekOpts =
          lekRes?.data?.success && Array.isArray(lekRes.data.data)
            ? lekRes.data.data.map((u) => ({
                value: u.jkl,
                label: `${u.jkl} | ${u.naziv}`,
              }))
            : [];

        setDijagnozeOptions(dOpts);
        setOdeljenjaOptions(oOpts);
        setVrstaOtpustaOptions(vOpts);
        setUputiOptions(uOpts);
        setPovredeOptions(pOpts);
        setProcedureOptions(prOpts);
        setLekOptions(lekOpts);
      } catch (e) {
        console.error(e);
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

  const defaultTemplate = {
    brojistorije: null,
    tezinanovorodjence: null,
    datumprijema: null,
    datumotpusta: null,
    sifrauputasl: null,
    sifrapovrede: null,
    sifradijagnozeuzrokhosp: null,
    sifradijagnozeuzroksmrti: null,
    sifraodeljenjaprijemno: null,
    vrstaotpusta: null,
    brlicencezatvorio: null,
  };

  const templateKeys = Object.keys(defaultTemplate).filter(
    (k) => k !== "stavke",
  );

  const fieldConfig = {
    datumprijema: { type: "date" },
    datumotpusta: { type: "date" },
    sifraodeljenjaprijemno: { type: "select", options: odeljenjaOptions },
    vrstaotpusta: { type: "select", options: vrstaOtpustaOptions },
    sifradijagnozeuzrokhosp: { type: "select", options: dijagnozeOptions },
    sifradijagnozeuzroksmrti: { type: "select", options: dijagnozeOptions },
    sifrauputasl: { type: "select", options: uputiOptions },
    sifrapovrede: { type: "select", options: povredeOptions },
    brlicencezatvorio: { readOnly: true },
  };

  const create = async (item) => await createHook(normalizeIstorija(item));
  const update = async (id, item) =>
    await updateHook(id, normalizeIstorija(item));
  const remove = async (id) => await removeHook(id);

  const handleEdit = (row) => {
    const full = istorije.find((i) => i[idField] === row[idField]) || row;
    setSelectedItem(full);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDetails = (row) => {
    const full = istorije.find((i) => i[idField] === row[idField]) || row;
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

  const normalizeIstorija = (item) => {
    const normalized = {
      ...item,
      tezinanovorodjence:
        item.tezinanovorodjence === "" ? null : item.tezinanovorodjence,
      doza: item.doza === "" ? null : item.doza,
      datumotpusta: item.datumotpusta === "" ? null : item.datumotpusta,
      sifrapovrede: item.sifrapovrede === "" ? null : item.sifrapovrede,
      sifradijagnozeuzroksmrti:
        item.sifradijagnozeuzroksmrti === ""
          ? null
          : item.sifradijagnozeuzroksmrti,
      vrstaotpusta: item.vrstaotpusta === "" ? null : item.vrstaotpusta,
      dijagnoze: Array.isArray(item.dijagnoze)
        ? item.dijagnoze.map((d) =>
            typeof d === "object" ? d.sifradijagnoze : d,
          )
        : [],

      procedure: Array.isArray(item.procedure)
        ? item.procedure.map((p) =>
            typeof p === "object" ? p.sifraprocedure : p,
          )
        : [],
    };
    const trebaPostavitiBrLic =
      normalized.datumotpusta !== null ||
      normalized.sifradijagnozeuzroksmrti !== null ||
      normalized.vrstaotpusta !== null;

    if (trebaPostavitiBrLic) {
      normalized.brlicencezatvorio = vratiKorisnika().brlicence;
    } else normalized.brlicencezatvorio = null;

    return normalized;
  };

  const handleStavkeUpdate = async (noveStavke) => {
    const payload = {
      ...selectedItem,
      stavke: noveStavke.map((s) => ({
        brstavkeistorije: s.brstavkeistorije,
        jkl: s.jkl,
        datumvreme: s.datumvreme,
        toknalazi: s.toknalazi,
        doza: s.doza,
      })),
      procedure: selectedItem.procedure.map((p) => p.sifraprocedure),
      dijagnoze: selectedItem.dijagnoze.map((d) => d.sifradijagnoze),
    };

    const res = await updateHook(selectedItem[idField], payload);
    if (res && res.success) setSelectedItem(res.data.data);

    return res;
  };

  const handleDijagnozeUpdate = async (noveDijagnoze) => {
    const payload = {
      ...selectedItem,
      dijagnoze: noveDijagnoze.map((d) => d.sifradijagnoze),
      procedure: selectedItem.procedure.map((p) => p.sifraprocedure),
    };

    const res = await updateHook(selectedItem[idField], payload);
    if (res && res.success) setSelectedItem(res.data.data);

    return res;
  };

  const handleProcedureUpdate = async (noveProcedure) => {
    const payload = {
      ...selectedItem,
      procedure: noveProcedure.map((p) => p.sifraprocedure),
      dijagnoze: selectedItem.dijagnoze.map((d) => d.sifradijagnoze),
    };

    const res = await updateHook(selectedItem[idField], payload);
    if (res && res.success) setSelectedItem(res.data.data);

    return res;
  };

  const tableColumns = [
    "brojistorije",
    "datumprijema",
    "datumotpusta",
    "sifrauputasl",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />

      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />

        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Istorije bolesti
        </h1>

        {loading || metaLoading ? (
          <div className="text-center">Učitavanje...</div>
        ) : (
          <GenericTable
            data={istorije || []}
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

            {selectedItem.stavke && selectedItem.stavke.length >= 0 && (
              <StavkeIstorije
                parentItem={selectedItem}
                onSave={handleStavkeUpdate}
                parentMode={formMode}
                opts={lekOptions}
              />
            )}

            {selectedItem.stavke && selectedItem.stavke.length >= 0 && (
              <DijagnozeIstorije
                parentItem={selectedItem}
                onSave={handleDijagnozeUpdate}
                parentMode={formMode}
                opts={dijagnozeOptions}
              />
            )}

            {selectedItem.stavke && selectedItem.stavke.length >= 0 && (
              <ProcedureIstorije
                parentItem={selectedItem}
                onSave={handleProcedureUpdate}
                parentMode={formMode}
                opts={procedureOptions}
              />
            )}
          </div>
        )}

        {!showForm && (
          <button
            onClick={handleCreateOpen}
            className="mt-6 px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Dodaj istoriju
          </button>
        )}
      </main>
    </div>
  );
};

export default IstorijeBolesti;

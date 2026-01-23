import { useState, useEffect } from "react";

const GenericForm = ({
  item,
  template,
  fieldConfig = {},
  mode = "edit",
  onClose,
  onCreate,
  onUpdate,
  idField = "id",
}) => {
  const [formData, setFormData] = useState({});
  const izmena = mode === "edit";
  const viewOnly = mode === "view";

  useEffect(() => {
    const normalizeValue = (key, val) => {
      if (val == null) return "";

      const cfg = fieldConfig[key];

      if (cfg?.type === "datetime") {
        const d = new Date(val);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16);
      }

      if (cfg?.type === "date") {
        const d = new Date(val);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
      }

      return val;
    };

    if (item) {
      const newItem = { ...item };
      Object.keys(newItem).forEach((k) => {
        newItem[k] = normalizeValue(k, newItem[k]);
      });

      Object.keys(fieldConfig).forEach((fk) => {
        if (fieldConfig[fk].type === "hidden" && newItem[fk] === undefined) {
          newItem[fk] = "";
        }
      });

      setFormData(newItem);
    } else if (template) {
      const keys = Array.isArray(template) ? template : Object.keys(template);
      const empty = {};
      keys.forEach((k) => (empty[k] = ""));

      Object.keys(fieldConfig).forEach((fk) => {
        if (fieldConfig[fk].type === "hidden" && empty[fk] === undefined) {
          empty[fk] = "";
        }
      });

      setFormData(empty);
    } else {
      setFormData({});
    }
  }, [item, template, fieldConfig]);

  const handleChange = (key, value) => {
    setFormData((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      let res;
      if (mode === "edit") {
        res = await onUpdate(formData[idField], formData);
      } else if (mode === "create") {
        res = await onCreate(formData);
      }

      if (res && res.success === true) {
        onClose();
      } else {
        console.warn("Akcija nije uspela.");
      }
    } catch (err) {
      console.error("Greška u handleSubmit-u:", err);
    }
  };
  const keys =
    template && Array.isArray(template)
      ? template
      : Object.keys(formData || {});

  if (!keys.length) {
    return (
      <div className="mt-6 w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <div className="text-center text-gray-600">
          Nema polja za prikaz. Prosledi "template".
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Zatvori
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 mb-16 w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {mode === "view" ? "Detalji reda" : izmena ? "Izmeni red" : "Novi red"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => {
          const cfg = fieldConfig[key] || {};
          if (cfg.type === "hidden") return null;

          if (cfg.type === "select") {
            return (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">
                  {key}
                </label>
                <select
                  value={formData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`w-full p-2 border rounded ${
                    cfg.readOnly || viewOnly ? "bg-gray-300" : ""
                  }`}
                  disabled={cfg.readOnly || viewOnly}
                  readOnly={cfg.readOnly || viewOnly}
                >
                  <option value="">-- izaberi --</option>
                  {(cfg.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if ((mode === "edit" || mode === "view") && key === idField) {
            return (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">
                  {key}
                </label>
                <div className="p-2 border rounded bg-gray-300">
                  {formData[key]}
                </div>
              </div>
            );
          }

          if (cfg.type === "textarea") {
            return (
              <div key={key} className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">
                  {key}
                </label>
                <textarea
                  value={formData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={4}
                  className={`w-full p-2 border rounded resize-none ${
                    viewOnly ? "bg-gray-300" : ""
                  }`}
                  readOnly={viewOnly}
                  disabled={viewOnly}
                />
              </div>
            );
          }

          let inputType = "text";
          if (cfg.type === "date") inputType = "date";
          if (cfg.type === "datetime") inputType = "datetime-local";

          return (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{key}</label>
              <input
                type={inputType}
                value={formData[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full p-2 border rounded ${
                  cfg.readOnly || viewOnly ? "bg-gray-300" : ""
                }`}
                readOnly={cfg.readOnly || viewOnly}
                disabled={viewOnly}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center gap-2">
        {!viewOnly && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Sačuvaj
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          {viewOnly ? "Zatvori" : "Otkaži"}
        </button>
      </div>
    </div>
  );
};

export default GenericForm;

import { useState, useEffect } from "react";
import { parseISO, isValid } from "date-fns";

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
    const parseValue = (val) => {
      if (!val) return "";
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d.toISOString().slice(0, 16);
    };

    if (item) {
      const newItem = { ...item };
      Object.keys(newItem).forEach((k) => {
        newItem[k] = parseValue(newItem[k]);
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
  }, [item, template, JSON.stringify(fieldConfig)]);

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
      if (res && res.success) {
        onClose();
      } else {
        console.warn("Akcija nije uspela, ostajem u formi da prikažem grešku.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const keys =
    template && Array.isArray(template)
      ? template
      : Object.keys(formData || {});

  if (!keys || keys.length === 0) {
    return (
      <div className="mt-6 w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
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
    <div className="mt-6 mb-16 w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        {mode === "view" ? "Detalji" : izmena ? "Izmeni stavku" : "Nova stavka"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {keys.map((key) => {
          const cfg = fieldConfig[key] || {};

          if (cfg.type === "hidden") {
            if (formData[key] === undefined) {
              setFormData((s) => ({ ...s, [key]: "" }));
            }
            return null;
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

          if (cfg.type === "select") {
            const opts = cfg.options || [];
            return (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">
                  {key}
                </label>
                <select
                  value={formData[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`w-full p-2 border rounded ${
                    viewOnly ? "bg-gray-300" : ""
                  }`}
                  disabled={viewOnly}
                >
                  <option value="">-- izaberi --</option>
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          const inputType = isValid(parseISO(formData[key] ?? ""))
            ? "datetime-local"
            : "text";

          const readOnly = cfg.readOnly || false;
          return (
            <div key={key}>
              <label className="block text-sm text-gray-600 mb-1">{key}</label>
              <input
                type={inputType}
                placeholder={key}
                value={formData[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full p-2 border rounded ${
                  readOnly || viewOnly ? "bg-gray-300" : ""
                }`}
                readOnly={readOnly || viewOnly}
                disabled={viewOnly}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex gap-2">
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

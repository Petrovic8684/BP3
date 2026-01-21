import { useState, useEffect } from "react";
import { api } from "../lib/api";

export const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greska, setGreska] = useState(null);

  const handleError = (err) => {
    if (err?.response) {
      const d = err.response.data;
      setGreska(
        d?.message
          ? `${d.message}${d.error ? ` (${d.error})` : ""}`
          : `Greška: ${err.response.status}`,
      );
      return { success: false, message: d?.message, error: d?.error };
    } else if (err?.request) {
      setGreska("Greška: Nema odgovora od servera");
      return { success: false, message: "Nema odgovora od servera" };
    } else {
      setGreska("Greška: " + err.message);
      return { success: false, message: err.message };
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoint);
      if (res.data?.success) {
        setData(res.data.data);
        setGreska(null);
        return { success: true, data: res.data.data };
      } else {
        const msg = `${res.data?.message || "Greška"}${res.data?.error ? ` (${res.data.error})` : ""}`;
        setGreska(msg);
        return {
          success: false,
          message: res.data?.message,
          error: res.data?.error,
        };
      }
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (item) => {
    try {
      const res = await api.post(endpoint, item);
      if (res.data?.success) {
        setGreska(null);
        await fetchData();
        return { success: true, data: res.data };
      } else {
        const msg = `${res.data?.message || "Greška"}${res.data?.error ? ` (${res.data.error})` : ""}`;
        setGreska(msg);
        return {
          success: false,
          message: res.data?.message,
          error: res.data?.error,
        };
      }
    } catch (err) {
      return handleError(err);
    }
  };

  const update = async (id, item) => {
    try {
      const res = await api.patch(`${endpoint}/${id}`, item);
      if (res.data?.success) {
        setGreska(null);
        await fetchData();
        return { success: true, data: res.data };
      } else {
        const msg = `${res.data?.message || "Greška"}${res.data?.error ? ` (${res.data.error})` : ""}`;
        setGreska(msg);
        return {
          success: false,
          message: res.data?.message,
          error: res.data?.error,
        };
      }
    } catch (err) {
      return handleError(err);
    }
  };

  const remove = async (id) => {
    try {
      const res = await api.delete(`${endpoint}/${id}`);
      if (res.data?.success) {
        setGreska(null);
        await fetchData();
        return { success: true, data: res.data };
      } else {
        const msg = `${res.data?.message || "Greška"}${res.data?.error ? ` (${res.data.error})` : ""}`;
        setGreska(msg);
        return {
          success: false,
          message: res.data?.message,
          error: res.data?.error,
        };
      }
    } catch (err) {
      return handleError(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, greska, create, update, remove, fetchData };
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

import Logo from "../components/logo";
import vratiKorisnika from "../lib/vratiKorisnika";

const Prijava = () => {
  const [brLicence, setBrLicence] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (vratiKorisnika()) navigate("/", { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/pruzalacusluge/prijava", {
        brlicence: brLicence,
        lozinka,
      });

      if (response?.success === false) {
        setGreska(response?.message + " (" + response?.error + ")");
        return;
      }

      const token = response.data.token;
      if (!token) {
        setGreska("Server nije vratio token.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Došlo je do greške.";
      setGreska(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-0 px-6">
      <Logo />

      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Prijava
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="brLicence" className="block text-gray-700">
              Broj licence
            </label>
            <input
              type="text"
              id="brLicence"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Unesite broj licence"
              value={brLicence}
              onChange={(e) => setBrLicence(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="lozinka" className="block text-gray-700">
              Lozinka
            </label>
            <input
              type="password"
              id="lozinka"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Unesite lozinku"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700"
          >
            Prijavi se
          </button>

          {greska && (
            <div className="text-red-500 mt-6 text-center break-words">
              {greska}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Prijava;

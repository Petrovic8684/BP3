import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vratiKorisnika from "../lib/vratiKorisnika";
import { Kartica, karticePoUlozi } from "../components/kartica";

import Logo from "../components/logo";
import Header from "../components/header";

const Pocetna = () => {
  const navigate = useNavigate();
  const korisnik = vratiKorisnika();

  const ulogaConfig = {
    S: {
      label: "Lekar specijalista",
      className: "text-indigo-600",
    },
    D: {
      label: "Doktor medicine",
      className: "text-teal-600",
    },
    T: {
      label: "Medicinski tehničar",
      className: "text-slate-500",
    },
  };

  useEffect(() => {
    if (!korisnik) {
      const tajmer = setTimeout(() => {
        navigate("/prijava");
      }, 2000);

      return () => clearTimeout(tajmer);
    }
  }, [korisnik, navigate]);

  if (!korisnik) {
    return (
      <div className="text-center mt-20 text-gray-600">Niste prijavljeni.</div>
    );
  }

  const kartice = karticePoUlozi[korisnik.uloga] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header korisnik={korisnik} />

      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />

        <h1 className="text-2xl font-bold text-gray-700 mb-3 text-center">
          Dobro došli, {korisnik.prezimeime}!
        </h1>

        <p
          className={`font-medium uppercase tracking-wide mb-8 text-center ${
            ulogaConfig[korisnik.uloga]?.className || "text-gray-500"
          }`}
        >
          {ulogaConfig[korisnik.uloga]?.label}
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {kartice.map((kartica, indeks) => (
            <Kartica
              key={indeks}
              naslov={kartica.naslov}
              slika={kartica.slika}
              ruta={kartica.ruta}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pocetna;

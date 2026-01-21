import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import vratiKorisnika from "../lib/vratiKorisnika";
import { Kartica, karticePoUlozi } from "../components/kartica";

import Logo from "../components/logo";
import Odjava from "../components/odjava";

const Pocetna = () => {
  const navigate = useNavigate();
  const korisnik = vratiKorisnika();

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
      <Odjava korisnik={korisnik} />

      <main className="flex flex-col items-center pt-12 px-6">
        <Logo className="mb-6" />

        <h1 className="text-2xl font-bold text-gray-700 mb-8 text-center">
          Dobro došli, {korisnik.prezimeime}!
        </h1>

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

import { useNavigate } from "react-router-dom";

import registrovaniPacijentSlika from "../assets/slike/registrovanipacijent.svg";
import istorijaBolestiSlika from "../assets/slike/istorijabolesti.svg";
import nalogZaDavanjeInjekcijaSlika from "../assets/slike/nalogzadavanjeinjekcija.svg";
import izvestajLekaraSpecijalisteSlike from "../assets/slike/izvestajlekaraspecijaliste.svg";
import otpusnaListaSlika from "../assets/slike/otpusnalista.svg";
import uputZaAmbulantnoSpecijalistickiPregledSlika from "../assets/slike/uputzaambulantnospecijalistickipregled.svg";
import uputZaStacionarnoLecenjeSlika from "../assets/slike/uputzastacionarnolecenje.svg";
import vrstaOtpustaSlika from "../assets/slike/vrstaOtpustaSlika.svg";
import preporukaLekovaSlika from "../assets/slike/preporukaLekovaSlika.svg";

export const Kartica = ({ naslov, slika, ruta }) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-60 md:w-80 h-60 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() => navigate(ruta)}
    >
      <img src={slika} alt={naslov} className="w-16 h-16 mb-4" />
      <h3 className="text-lg font-semibold text-teal-700 text-center px-2">
        {naslov}
      </h3>
    </div>
  );
};

export const karticePoUlozi = {
  T: [
    {
      naslov: "Registrovani pacijenti",
      slika: registrovaniPacijentSlika,
      ruta: "/registrovanipacijent",
    },
    {
      naslov: "Nalozi za davanje injekcija",
      slika: nalogZaDavanjeInjekcijaSlika,
      ruta: "/nalogzadavanjeinjekcija",
    },
  ],
  D: [
    {
      naslov: "Uputi za ambulantno specijalisticki pregled",
      slika: uputZaAmbulantnoSpecijalistickiPregledSlika,
      ruta: "/uputzaambulantnospecijalistickipregled",
    },
    {
      naslov: "Uputi za stacionarno lecenje",
      slika: uputZaStacionarnoLecenjeSlika,
      ruta: "/uputzastacionarnolecenje",
    },
    {
      naslov: "Nalozi za davanje injekcija",
      slika: nalogZaDavanjeInjekcijaSlika,
      ruta: "/nalogzadavanjeinjekcija",
    },
  ],
  S: [
    {
      naslov: "Izvestaji lekara specijaliste",
      slika: izvestajLekaraSpecijalisteSlike,
      ruta: "/izvestajlekaraspecijaliste",
    },
    {
      naslov: "Istorije bolesti",
      slika: istorijaBolestiSlika,
      ruta: "/istorijabolesti",
    },
    {
      naslov: "Otpusne liste",
      slika: otpusnaListaSlika,
      ruta: "/otpusnalista",
    },
    {
      naslov: "Vrste otpusta",
      slika: vrstaOtpustaSlika,
      ruta: "/vrsteotpusta",
    },
    {
      naslov: "Preporuka lekova",
      slika: preporukaLekovaSlika,
      ruta: "/preporukalekova",
    },
  ],
};

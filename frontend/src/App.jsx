import { Routes, Route } from "react-router-dom";
import Prijava from "./pages/Prijava";
import Pocetna from "./pages/Pocetna";
import RegistrovaniPacijenti from "./pages/RegistrovaniPacijenti";
import NaloziZaDavanjeInjekcija from "./pages/NaloziZaDavanjeInjekcija";
import UputiZaAmbulantnoSpecijalistickiPregled from "./pages/UputiZaAmbulantnoSpecijalistickiPregled";
import UputiZaStacionarnoLecenje from "./pages/UputiZaStacionarnoLecenje";
import IzvestajiLekaraSpecijaliste from "./pages/IzvestajiLekaraSpecijaliste";
import IstorijeBolesti from "./pages/IstorijeBolesti";
import OtpusneListe from "./pages/OtpusneListe";
import Nepoznato from "./pages/Nepoznato";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Pocetna />} />
      <Route path="/prijava" element={<Prijava />} />
      <Route path="/registrovanipacijent" element={<RegistrovaniPacijenti />} />
      <Route
        path="/nalogzadavanjeinjekcija"
        element={<NaloziZaDavanjeInjekcija />}
      />
      <Route
        path="/uputzaambulantnospecijalistickipregled"
        element={<UputiZaAmbulantnoSpecijalistickiPregled />}
      />
      <Route
        path="/uputzastacionarnolecenje"
        element={<UputiZaStacionarnoLecenje />}
      />
      <Route
        path="/izvestajlekaraspecijaliste"
        element={<IzvestajiLekaraSpecijaliste />}
      />
      <Route path="/istorijabolesti" element={<IstorijeBolesti />} />
      <Route path="/otpusnalista" element={<OtpusneListe />} />
      <Route path="*" element={<Nepoznato />} />
    </Routes>
  );
}

export default App;

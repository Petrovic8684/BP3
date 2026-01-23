import express from "express";
import cors from "cors";
import { initDB } from "./db/db.js";
import schedulePartitionCreation from "./helpers/schedule.js";

import registrovaniPacijentRoutes from "./routes/registrovaniPacijentRoutes.js";
import dijagnozaRoutes from "./routes/dijagnozaRoutes.js";
import vrstaOtpustaRoutes from "./routes/vrstaOtpustaRoutes.js";
import uputZaAmbulantnoSpecijalistickiPregledRoutes from "./routes/uputZaAmbulantnoSpecijalistickiPregledRoutes.js";
import izvestajLekaraSpecijalisteRoutes from "./routes/izvestajLekaraSpecijalisteRoutes.js";
import uputZaStacionarnoLecenjeRoutes from "./routes/uputZaStacionarnoLecenjeRoutes.js";
import otpusnaListaRoutes from "./routes/otpusnaListaRoutes.js";
import nalogZaDavanjeInjekcijaRoutes from "./routes/nalogZaDavanjeInjekcijaRoutes.js";
import istorijaBolestiRoutes from "./routes/istorijaBolestiRoutes.js";
import lekRoutes from "./routes/lekRoutes.js";
import mestoRoutes from "./routes/mestoRoutes.js";
import doktorMedicineRoutes from "./routes/doktorMedicineRoutes.js";
import specijalistaRoutes from "./routes/specijalistaRoutes.js";
import pruzalacUslugeRotues from "./routes/pruzalacUslugeRoutes.js";
import medicinskiTehnicarRoutes from "./routes/medicinskiTehnicarRoutes.js";
import odeljenjeRoutes from "./routes/odeljenjeRoutes.js";
import uzrokPovredeRoutes from "./routes/uzrokPovredeRoutes.js";
import proceduraRoutes from "./routes/proceduraRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

await initDB();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Dobro došli!",
    success: true,
  });
});

app.use("/registrovanipacijent", registrovaniPacijentRoutes);
app.use("/dijagnoza", dijagnozaRoutes);
app.use("/vrstaotpusta", vrstaOtpustaRoutes);
app.use(
  "/uputzaambulantnospecijalistickipregled",
  uputZaAmbulantnoSpecijalistickiPregledRoutes,
);
app.use("/izvestajlekaraspecijaliste", izvestajLekaraSpecijalisteRoutes);
app.use("/uputzastacionarnolecenje", uputZaStacionarnoLecenjeRoutes);
app.use("/otpusnalista", otpusnaListaRoutes);
app.use("/nalogzadavanjeinjekcija", nalogZaDavanjeInjekcijaRoutes);
app.use("/istorijabolesti", istorijaBolestiRoutes);
app.use("/lek", lekRoutes);
app.use("/mesto", mestoRoutes);
app.use("/doktormedicine", doktorMedicineRoutes);
app.use("/specijalista", specijalistaRoutes);
app.use("/pruzalacusluge", pruzalacUslugeRotues);
app.use("/medicinskitehnicar", medicinskiTehnicarRoutes);
app.use("/odeljenje", odeljenjeRoutes);
app.use("/uzrokpovrede", uzrokPovredeRoutes);
app.use("/procedura", proceduraRoutes);

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
  console.log(`[index.js] Server je pokrenut na portu ${port}`);

  schedulePartitionCreation();
});

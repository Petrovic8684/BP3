import express from "express";
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

const app = express();
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

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
  console.log(`[index.js] Server je pokrenut na portu ${port}`);

  schedulePartitionCreation();
});

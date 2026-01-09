import express from "express";
import { initDB } from "./db/db.js";
import searchRouter from "./routes/search.js";

const app = express();
app.use(express.json());

await initDB();

app.get("/", (req, res) => {
  res.send("Dobro došli!");
});

app.use("/search", searchRouter);

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => {
  console.log(`[index.js] Server je pokrenut na portu ${port}`);
});

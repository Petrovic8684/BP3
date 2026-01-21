import pkg from "pg";
import { generateEmbedding, initEmbedder } from "../helpers/embeddings.js";

const { Client } = pkg;

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

let initialized = false;

async function initDB() {
  if (initialized) return client;

  try {
    await initEmbedder();

    await client.connect();
    await client.query("LISTEN new_dijagnoza");

    console.log("[db.js] Povezan sa bazom");
    initialized = true;

    return client;
  } catch (err) {
    console.error("[db.js] Greška pri povezivanju sa bazom:", err);
    process.exit(1);
  }
}

client.on("notification", async (msg) => {
  try {
    if (!msg.payload) return;
    const sifraDijagnoze = msg.payload;

    const res = await client.query(
      `SELECT opis FROM dijagnoza WHERE sifradijagnoze = $1`,
      [sifraDijagnoze],
    );

    if (res.rows.length === 0) return;
    const text = res.rows[0].opis;

    const embedding = await generateEmbedding(text);
    const vectorLiteral = "[" + embedding.join(",") + "]";

    await client.query(
      `UPDATE dijagnoza SET embedding = $1::vector WHERE sifradijagnoze = $2`,
      [vectorLiteral, sifraDijagnoze],
    );
  } catch (err) {
    console.error("[db.js] Greška u NOTIFY handleru:", err);
  }
});

export { initDB, client };

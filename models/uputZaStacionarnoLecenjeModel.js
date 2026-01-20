import { client } from "../db/db.js";

const TABLE = "uputzastacionarnolecenje";

const uputZaStacionarnoLecenjeModel = {
  create: async (data) => {
    const { sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze)
         VALUES ($1, $2, $3, $4, $5)`,
        [sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze],
      );

      await client.query("COMMIT");

      return await uputZaStacionarnoLecenjeModel.read(sifrauputasl);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  read: async (sifrauputasl) => {
    const result = await client.query(
      `SELECT sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze, naziv
       FROM ${TABLE}
       WHERE sifrauputasl = $1`,
      [sifrauputasl],
    );

    return result.rows[0] || null;
  },

  update: async (sifrauputasl, data) => {
    const { datum, brprotokola, jmbg, sifradijagnoze } = data;

    try {
      const existing = await uputZaStacionarnoLecenjeModel.read(sifrauputasl);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET datum = COALESCE($2, datum),
         brprotokola = COALESCE($3, brprotokola),
         jmbg = COALESCE($4, jmbg),
         sifradijagnoze = COALESCE($5, sifradijagnoze)
         WHERE sifrauputasl = $1`,
        [sifrauputasl, datum, brprotokola, jmbg, sifradijagnoze],
      );

      await client.query("COMMIT");

      return await uputZaStacionarnoLecenjeModel.read(sifrauputasl);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifrauputasl) => {
    try {
      const existing = await uputZaStacionarnoLecenjeModel.read(sifrauputasl);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(`DELETE FROM ${TABLE} WHERE sifrauputasl = $1`, [
        sifrauputasl,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default uputZaStacionarnoLecenjeModel;

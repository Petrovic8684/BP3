import { client } from "../db/db.js";

const TABLE = "izvestajlekaraspecijaliste";

const izvestajLekaraSpecijalisteModel = {
  create: async (data) => {
    const {
      sifraizvestaja,
      datumvreme,
      brprotokola,
      nalazmisljenje,
      sifrauputaas,
      sifradijagnoze,
    } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifraizvestaja, datumvreme, brprotokola, nalazmisljenje, sifrauputaas, sifradijagnoze)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          sifraizvestaja,
          datumvreme,
          brprotokola,
          nalazmisljenje,
          sifrauputaas,
          sifradijagnoze,
        ],
      );

      await client.query("COMMIT");

      return await izvestajLekaraSpecijalisteModel.read(sifraizvestaja);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  readAll: async () => {
    const result = await client.query(
      `SELECT sifraizvestaja, datumvreme, brprotokola, nalazmisljenje, sifrauputaas, sifradijagnoze
       FROM ${TABLE}`,
    );

    return result.rows || null;
  },

  read: async (sifraizvestaja) => {
    const result = await client.query(
      `SELECT sifraizvestaja, datumvreme, brprotokola, nalazmisljenje, sifrauputaas, sifradijagnoze
       FROM ${TABLE}
       WHERE sifraizvestaja = $1`,
      [sifraizvestaja],
    );

    return result.rows[0] || null;
  },

  update: async (sifraizvestaja, data) => {
    const {
      datumvreme,
      brprotokola,
      nalazmisljenje,
      sifrauputaas,
      sifradijagnoze,
    } = data;

    try {
      const existing =
        await izvestajLekaraSpecijalisteModel.read(sifraizvestaja);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET datumvreme = COALESCE($2, datumvreme),
         brprotokola = COALESCE($3, brprotokola),
         nalazmisljenje = COALESCE($4, nalazmisljenje),
         sifrauputaas = COALESCE($5, sifrauputaas),
         sifradijagnoze = COALESCE($6, sifradijagnoze)
         WHERE sifraizvestaja = $1`,
        [
          sifraizvestaja,
          datumvreme,
          brprotokola,
          nalazmisljenje,
          sifrauputaas,
          sifradijagnoze,
        ],
      );

      await client.query("COMMIT");

      return await izvestajLekaraSpecijalisteModel.read(sifraizvestaja);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifraizvestaja) => {
    try {
      const existing =
        await izvestajLekaraSpecijalisteModel.read(sifraizvestaja);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(`DELETE FROM ${TABLE} WHERE sifraizvestaja = $1`, [
        sifraizvestaja,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default izvestajLekaraSpecijalisteModel;

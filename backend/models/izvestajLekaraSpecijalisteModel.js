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

  readAll: async (brlicence) => {
    const params = [];

    let query;
    if (brlicence) {
      params.push(brlicence);
      query = `
      SELECT i.sifraizvestaja,
             i.datumvreme,
             i.brprotokola,
             i.nalazmisljenje,
             i.sifrauputaas,
             i.sifradijagnoze
      FROM ${TABLE} i
      JOIN uputzaambulantnospecijalistickipregled u
        ON u.sifrauputaas = i.sifrauputaas
      WHERE u.brlicenceza = $1
      ORDER BY i.datumvreme DESC, i.sifraizvestaja
    `;
    } else {
      query = `
      SELECT i.sifraizvestaja,
             i.datumvreme,
             i.brprotokola,
             i.nalazmisljenje,
             i.sifrauputaas,
             i.sifradijagnoze
      FROM ${TABLE} i
      ORDER BY i.datumvreme DESC, i.sifraizvestaja
    `;
    }

    const result = await client.query(query, params);
    return result.rows || [];
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

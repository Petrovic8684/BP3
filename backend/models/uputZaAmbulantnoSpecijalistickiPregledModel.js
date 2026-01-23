import { client } from "../db/db.js";
import { Uloge } from "../middleware/ulogeMiddleware.js";

const TABLE = "uputzaambulantnospecijalistickipregled";

const uputZaAmbulantnoSpecijalistickiPregledModel = {
  create: async (data) => {
    const { sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza } =
      data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza],
      );

      await client.query("COMMIT");

      return await uputZaAmbulantnoSpecijalistickiPregledModel.read(
        sifrauputaas,
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  readAll: async (brlicence, uloga) => {
    let query = `
    SELECT u.sifrauputaas,
           u.razlog,
           u.datum,
           u.brprotokola,
           u.jmbg,
           u.brlicenceza
    FROM ${TABLE} u
    JOIN registrovanipacijent r ON r.jmbg = u.jmbg
    WHERE 1=1
  `;

    const params = [];

    if (uloga === Uloge.DOKTOR && brlicence) {
      params.push(brlicence);
      query += ` AND r.brlicenceizbranidoktor = $${params.length}`;
    } else if (uloga === Uloge.SPECIJALISTA && brlicence) {
      params.push(brlicence);
      query += ` AND u.brlicenceza = $${params.length}`;
    }

    query += ` ORDER BY u.datum DESC, u.sifrauputaas`;

    const result = await client.query(query, params);
    return result.rows || null;
  },

  read: async (sifrauputaas) => {
    const result = await client.query(
      `SELECT sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza
       FROM ${TABLE}
       WHERE sifrauputaas = $1`,
      [sifrauputaas],
    );

    return result.rows[0] || null;
  },

  update: async (sifrauputaas, data) => {
    const { razlog, datum, brprotokola, jmbg, brlicenceza } = data;

    try {
      const existing =
        await uputZaAmbulantnoSpecijalistickiPregledModel.read(sifrauputaas);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET razlog = COALESCE($2, razlog),
         datum = COALESCE($3, datum),
         brprotokola = COALESCE($4, brprotokola),
         jmbg = COALESCE($5, jmbg),
         brlicenceza = COALESCE($6, brlicenceza)
         WHERE sifrauputaas = $1`,
        [sifrauputaas, razlog, datum, brprotokola, jmbg, brlicenceza],
      );

      await client.query("COMMIT");

      return await uputZaAmbulantnoSpecijalistickiPregledModel.read(
        sifrauputaas,
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifrauputaas) => {
    try {
      const existing =
        await uputZaAmbulantnoSpecijalistickiPregledModel.read(sifrauputaas);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(`DELETE FROM ${TABLE} WHERE sifrauputaas = $1`, [
        sifrauputaas,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default uputZaAmbulantnoSpecijalistickiPregledModel;

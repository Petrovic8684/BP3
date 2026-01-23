import { client } from "../db/db.js";

const MASTER_TABLE = "primalacusluge";
const DETAILS_TABLE = "vw_registrovanipacijent_full";

const registrovaniPacijentModel = {
  create: async (data) => {
    const {
      jmbg,
      prezimeime,
      pol,
      imeroditelja,
      datumrodjenja,
      posao,
      lbo,
      brknjizice,
      adresa,
      ppt,
      brlicencetehnicardodao,
      brlicenceizbranidoktor,
    } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${MASTER_TABLE} (jmbg, prezimeime)
         VALUES ($1, $2)`,
        [jmbg, prezimeime],
      );

      await client.query(
        `INSERT INTO ${DETAILS_TABLE}
         (jmbg, pol, imeroditelja, datumrodjenja, posao, lbo, brknjizice, adresa, ppt, brlicencetehnicardodao, brlicenceizbranidoktor)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          jmbg,
          pol,
          imeroditelja,
          datumrodjenja,
          posao,
          lbo,
          brknjizice,
          adresa,
          ppt,
          brlicencetehnicardodao,
          brlicenceizbranidoktor,
        ],
      );

      await client.query("COMMIT");

      return await registrovaniPacijentModel.read(jmbg);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  read: async (jmbg) => {
    const result = await client.query(
      `SELECT m.jmbg, m.prezimeime,
           d.pol, d.imeroditelja, d.datumrodjenja, d.posao,
           d.lbo, d.brknjizice, d.adresa, d.ppt,
           d.brlicencetehnicardodao, d.brlicenceizbranidoktor
       FROM ${MASTER_TABLE} m
       LEFT JOIN ${DETAILS_TABLE} d USING (jmbg)
       WHERE m.jmbg = $1`,
      [jmbg],
    );

    return result.rows[0] || null;
  },

  readAll: async (search, brlicence) => {
    let query = `
      SELECT m.jmbg, m.prezimeime,
            d.pol, d.imeroditelja, d.datumrodjenja, d.posao,
            d.lbo, d.brknjizice, d.adresa, d.ppt,
            d.brlicencetehnicardodao, d.brlicenceizbranidoktor
      FROM primalacusluge m
      LEFT JOIN vw_registrovanipacijent_full d USING (jmbg)
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      params.push(`${search.toLowerCase()}%`);
      query += ` AND LOWER(m.prezimeime) LIKE $${params.length}`;
    }

    if (brlicence) {
      params.push(brlicence);
      query += ` AND d.brlicenceizbranidoktor = $${params.length}`;
    }

    const result = await client.query(query, params);
    return result.rows;
  },

  update: async (jmbg, data) => {
    const {
      prezimeime,
      pol,
      imeroditelja,
      datumrodjenja,
      posao,
      lbo,
      brknjizice,
      adresa,
      ppt,
      brlicencetehnicardodao,
      brlicenceizbranidoktor,
    } = data;

    try {
      const existing = await registrovaniPacijentModel.read(jmbg);
      if (!existing) return null;

      await client.query("BEGIN");

      if (typeof prezimeime !== "undefined") {
        await client.query(
          `UPDATE ${MASTER_TABLE}
           SET prezimeime = $1
           WHERE jmbg = $2`,
          [prezimeime, jmbg],
        );
      }

      await client.query(
        `UPDATE ${DETAILS_TABLE}
         SET pol = COALESCE($2, pol),
             imeroditelja = COALESCE($3, imeroditelja),
             datumrodjenja = COALESCE($4, datumrodjenja),
             posao = COALESCE($5, posao),
             lbo = COALESCE($6, lbo),
             brknjizice = COALESCE($7, brknjizice),
             adresa = COALESCE($8, adresa),
             ppt = COALESCE($9, ppt),
             brlicencetehnicardodao = COALESCE($10, brlicencetehnicardodao),
             brlicenceizbranidoktor = COALESCE($11, brlicenceizbranidoktor)
         WHERE jmbg = $1`,
        [
          jmbg,
          pol,
          imeroditelja,
          datumrodjenja,
          posao,
          lbo,
          brknjizice,
          adresa,
          ppt,
          brlicencetehnicardodao,
          brlicenceizbranidoktor,
        ],
      );

      await client.query("COMMIT");

      return await registrovaniPacijentModel.read(jmbg);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (jmbg) => {
    try {
      const existing = await registrovaniPacijentModel.read(jmbg);
      if (!existing) return null;

      await client.query("BEGIN");
      await client.query(`DELETE FROM ${DETAILS_TABLE} WHERE jmbg = $1`, [
        jmbg,
      ]);
      await client.query(`DELETE FROM ${MASTER_TABLE} WHERE jmbg = $1`, [jmbg]);
      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default registrovaniPacijentModel;

import { client } from "../db/db.js";
import { Uloge } from "../middleware/ulogeMiddleware.js";

const TABLE = "nalogzadavanjeinjekcija";
const STAVKA_TABLE = "stavkanalogazadavanjeinjekcija";

const nalogZaDavanjeInjekcijaModel = {
  create: async (data) => {
    const { sifranalogainj, brprotokola, sifrauputasl, stavke } = data;
    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifranalogainj, brprotokola, sifrauputasl)
         VALUES ($1, $2, $3)`,
        [sifranalogainj, brprotokola, sifrauputasl],
      );

      if (Array.isArray(stavke) && stavke.length > 0) {
        const values = [];
        const params = [sifranalogainj];

        stavke.forEach((s, i) => {
          const offset = i * 3 + 2;
          values.push(`($${offset}, $1, $${offset + 1}, $${offset + 2})`);
          params.push(s.brstavke, s.jkl, s.propisanoampula);
        });

        const insertQuery = `
         INSERT INTO ${STAVKA_TABLE} (brstavke, sifranalogainj, jkl, propisanoampula)
         VALUES ${values.join(", ")}`;
        await client.query(insertQuery, params);
      }

      await client.query("COMMIT");

      return await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  read: async (sifranalogainj) => {
    const query = `
      SELECT n.*, 
             COALESCE(json_agg(s.*) FILTER (WHERE s.brstavke IS NOT NULL), '[]') as stavke
      FROM ${TABLE} n
      LEFT JOIN ${STAVKA_TABLE} s ON n.sifranalogainj = s.sifranalogainj
      WHERE n.sifranalogainj = $1
      GROUP BY n.sifranalogainj;
    `;
    const res = await client.query(query, [sifranalogainj]);
    return res.rows[0] || null;
  },

  readAll: async (brlicence, uloga) => {
    let query = `
    SELECT n.*,
           u.sifrauputasl AS u_sifrauputasl,
           u.jmbg       AS u_jmbg,
           u.brprotokola AS u_brprotokola,
           u.datum      AS u_datum,
           COALESCE(json_agg(s.*) FILTER (WHERE s.brstavke IS NOT NULL), '[]') AS stavke
    FROM ${TABLE} n
    JOIN uputzastacionarnolecenje u ON u.sifrauputasl = n.sifrauputasl
    JOIN registrovanipacijent p ON p.jmbg = u.jmbg
    LEFT JOIN ${STAVKA_TABLE} s ON n.sifranalogainj = s.sifranalogainj
    WHERE 1=1
  `;

    const params = [];

    if (uloga === Uloge.DOKTOR) {
      params.push(brlicence);
      query += ` AND p.brlicenceizbranidoktor = $${params.length}`;
    } else if (uloga === Uloge.TEHNICAR) {
      params.push(brlicence);
      query += ` AND (n.brlicenceizvrsio IS NULL OR n.brlicenceizvrsio = $${params.length})`;
    }

    query += `
    GROUP BY n.sifranalogainj, u.sifrauputasl, u.jmbg, u.brprotokola, u.datum
    ORDER BY u.datum DESC, n.sifranalogainj
  `;

    const res = await client.query(query, params);
    return res.rows || null;
  },

  update: async (sifranalogainj, data) => {
    const { brprotokola, sifrauputasl, brlicenceizvrsio, stavke } = data;

    try {
      await client.query("BEGIN");

      const existingNalog =
        await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);

      if (!existingNalog) {
        await client.query("ROLLBACK");
        return null;
      }

      await client.query(
        `UPDATE ${TABLE}
         SET brprotokola = COALESCE($2, brprotokola),
         sifrauputasl = COALESCE($3, sifrauputasl),
         brlicenceizvrsio = COALESCE($4, brlicenceizvrsio)
         WHERE sifranalogainj = $1`,
        [sifranalogainj, brprotokola, sifrauputasl, brlicenceizvrsio],
      );

      if (Array.isArray(stavke) && stavke.length > 0) {
        const values = [];
        const params = [sifranalogainj];

        stavke.forEach((s, i) => {
          const staraStavka = existingNalog.stavke.find(
            (ex) => ex.brstavke === s.brstavke,
          );

          const finalJkl = s.jkl || (staraStavka ? staraStavka.jkl : null);

          const finalPropisano =
            s.propisanoampula !== undefined
              ? s.propisanoampula
              : staraStavka
                ? staraStavka.propisanoampula
                : null;

          const finalDato =
            s.datoampula !== undefined
              ? s.datoampula
              : staraStavka
                ? staraStavka.datoampula
                : null;

          const finalDatum =
            s.datumvreme || (staraStavka ? staraStavka.datumvreme : null);

          const offset = i * 5 + 2;
          values.push(
            `($1, $${offset}, $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`,
          );

          params.push(
            s.brstavke,
            finalJkl,
            finalDatum,
            finalPropisano,
            finalDato,
          );
        });

        const upsertQuery = `INSERT INTO ${STAVKA_TABLE} (sifranalogainj, brstavke, jkl, datumvreme, propisanoampula, datoampula)
        VALUES ${values.join(", ")}
        ON CONFLICT (sifranalogainj, brstavke)
        DO UPDATE SET
        jkl = EXCLUDED.jkl,
        datumvreme = EXCLUDED.datumvreme,
        propisanoampula = EXCLUDED.propisanoampula,
        datoampula = EXCLUDED.datoampula;`;
        await client.query(upsertQuery, params);
      }

      await client.query("COMMIT");

      return await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifranalogainj) => {
    try {
      const existing = await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);
      if (!existing) return null;

      await client.query("BEGIN");
      await client.query(
        `DELETE FROM ${STAVKA_TABLE} WHERE sifranalogainj = $1`,
        [sifranalogainj],
      );
      await client.query(`DELETE FROM ${TABLE} WHERE sifranalogainj = $1`, [
        sifranalogainj,
      ]);
      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default nalogZaDavanjeInjekcijaModel;

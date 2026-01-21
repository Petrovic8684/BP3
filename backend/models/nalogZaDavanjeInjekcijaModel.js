import { client } from "../db/db.js";

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

      if (Array.isArray(stavke)) {
        for (const stavka of stavke) {
          const { brstavke, jkl, propisanoampula } = stavka;

          await client.query(
            `INSERT INTO ${STAVKA_TABLE} (brstavke, sifranalogainj, jkl, propisanoampula)
             VALUES ($1, $2, $3, $4)`,
            [brstavke, sifranalogainj, jkl, propisanoampula],
          );
        }
      }

      await client.query("COMMIT");

      return await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  read: async (sifranalogainj) => {
    const stavkeRes = await client.query(
      `SELECT brstavke, sifranalogainj, jkl, datumvreme, propisanoampula, datoampula, naziv, doza
       FROM ${STAVKA_TABLE}
       WHERE sifranalogainj = $1`,
      [sifranalogainj],
    );

    const nalogRes = await client.query(
      `SELECT sifranalogainj, brprotokola, sifrauputasl, brlicenceizvrsio
       FROM ${TABLE}
       WHERE sifranalogainj = $1`,
      [sifranalogainj],
    );

    if (!nalogRes.rows[0]) return null;

    return {
      ...nalogRes.rows[0],
      stavke: stavkeRes.rows,
    };
  },

  update: async (sifranalogainj, data) => {
    const { brprotokola, sifrauputasl, brlicenceizvrsio, stavke } = data;

    try {
      const existing = await nalogZaDavanjeInjekcijaModel.read(sifranalogainj);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET brprotokola = COALESCE($2, brprotokola),
         sifrauputasl = COALESCE($3, sifrauputasl),
         brlicenceizvrsio = COALESCE($4, brlicenceizvrsio)
         WHERE sifranalogainj = $1`,
        [sifranalogainj, brprotokola, sifrauputasl, brlicenceizvrsio],
      );

      if (Array.isArray(stavke)) {
        for (const stavka of stavke) {
          const { brstavke, jkl, datumvreme, propisanoampula, datoampula } =
            stavka;

          const existingRes = await client.query(
            `SELECT jkl, datumvreme, propisanoampula, datoampula FROM ${STAVKA_TABLE} WHERE sifranalogainj = $1 AND brstavke = $2`,
            [sifranalogainj, brstavke],
          );

          if (existingRes.rows.length === 0) {
            await client.query(
              `INSERT INTO ${STAVKA_TABLE} 
               (sifranalogainj, brstavke, jkl, datumvreme, propisanoampula, datoampula)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                sifranalogainj,
                brstavke,
                jkl,
                datumvreme,
                propisanoampula,
                datoampula,
              ],
            );
          } else {
            await client.query(
              `UPDATE ${STAVKA_TABLE} 
               SET jkl = COALESCE($3, jkl),
               datumvreme = COALESCE($4, datumvreme),
               propisanoampula = COALESCE($5, propisanoampula),
               datoampula = COALESCE($6, datoampula)
               WHERE sifranalogainj = $1 AND brstavke = $2`,
              [
                sifranalogainj,
                brstavke,
                jkl || existingRes.rows[0].jkl,
                datumvreme,
                propisanoampula || existingRes.rows[0].propisanoampula,
                datoampula,
              ],
            );
          }
        }
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

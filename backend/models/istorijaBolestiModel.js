import { client } from "../db/db.js";

const TABLE = "istorijabolesti";
const STAVKA_TABLE = "stavkaistorije";
const PROCEDURA_TABLE = "procedurazaistorija";
const DIJAGNOZA_TABLE = "dijagnozapratecaistorija";

const istorijaBolestiModel = {
  create: async (data) => {
    const {
      brojistorije,
      tezinanovorodjence,
      datumprijema,
      sifrauputasl,
      sifrapovrede,
      sifradijagnozeuzrokhosp,
      sifraodeljenjaprijemno,
    } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (brojistorije, tezinanovorodjence, datumprijema, sifrauputasl, sifrapovrede, sifradijagnozeuzrokhosp, sifraodeljenjaprijemno)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          brojistorije,
          tezinanovorodjence,
          datumprijema,
          sifrauputasl,
          sifrapovrede,
          sifradijagnozeuzrokhosp,
          sifraodeljenjaprijemno,
        ],
      );

      await client.query("COMMIT");

      return await istorijaBolestiModel.read(brojistorije);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  readAll: async () => {
    const istorijaRes = await client.query(
      `SELECT brojistorije, tezinanovorodjence, datumprijema, datumotpusta, sifrauputasl, sifrapovrede, sifradijagnozeuzrokhosp, sifradijagnozeuzroksmrti, brlicencezatvorio, sifraodeljenjaprijemno, vrstaotpusta
       FROM ${TABLE}`,
    );

    return istorijaRes.rows || null;
  },

  read: async (brojistorije) => {
    const istorijaRes = await client.query(
      `SELECT brojistorije, tezinanovorodjence, datumprijema, datumotpusta, sifrauputasl, sifrapovrede, sifradijagnozeuzrokhosp, sifradijagnozeuzroksmrti, brlicencezatvorio, sifraodeljenjaprijemno, vrstaotpusta
       FROM ${TABLE}
       WHERE brojistorije = $1`,
      [brojistorije],
    );

    const stavkeRes = await client.query(
      `SELECT brstavkeistorije, brojistorije, jkl, datumvreme, toknalazi, doza
       FROM ${STAVKA_TABLE}
       WHERE brojistorije = $1`,
      [brojistorije],
    );

    const procedureRes = await client.query(
      `SELECT p.sifraprocedure, p.naziv
       FROM procedura p JOIN ${PROCEDURA_TABLE} pzi
       ON p.sifraprocedure = pzi.sifraprocedure
       WHERE pzi.brojistorije = $1`,
      [brojistorije],
    );

    const dijagnozeRes = await client.query(
      `SELECT d.sifradijagnoze, d.naziv, d.opis
       FROM dijagnoza d JOIN ${DIJAGNOZA_TABLE} dpi
       ON d.sifradijagnoze = dpi.sifradijagnoze
       WHERE dpi.brojistorije = $1`,
      [brojistorije],
    );

    if (!istorijaRes.rows[0]) return null;

    return {
      ...istorijaRes.rows[0],
      procedure: procedureRes.rows,
      dijagnoze: dijagnozeRes.rows,
      stavke: stavkeRes.rows,
    };
  },

  update: async (brojistorije, data) => {
    const {
      tezinanovorodjence,
      datumprijema,
      datumotpusta,
      sifrauputasl,
      vrstaotpusta,
      sifrapovrede,
      sifradijagnozeuzrokhosp,
      sifradijagnozeuzroksmrti,
      brlicencezatvorio,
      sifraodeljenjaprijemno,
      stavke,
      procedure,
      dijagnoze,
    } = data;

    try {
      const existing = await istorijaBolestiModel.read(brojistorije);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET tezinanovorodjence = COALESCE($2, tezinanovorodjence),
         datumprijema = COALESCE($3, datumprijema),
         datumotpusta = COALESCE($4, datumotpusta),
         sifrauputasl = COALESCE($5, sifrauputasl),
         vrstaotpusta = COALESCE($6, vrstaotpusta),
         sifrapovrede = COALESCE($7, sifrapovrede),
         sifradijagnozeuzrokhosp = COALESCE($8, sifradijagnozeuzrokhosp),
         sifradijagnozeuzroksmrti = COALESCE($9, sifradijagnozeuzroksmrti),
         brlicencezatvorio = COALESCE($10, brlicencezatvorio),
         sifraodeljenjaprijemno = COALESCE($11, sifraodeljenjaprijemno)
         WHERE brojistorije = $1`,
        [
          brojistorije,
          tezinanovorodjence,
          datumprijema,
          datumotpusta,
          sifrauputasl,
          vrstaotpusta,
          sifrapovrede,
          sifradijagnozeuzrokhosp,
          sifradijagnozeuzroksmrti,
          brlicencezatvorio,
          sifraodeljenjaprijemno,
        ],
      );

      if (Array.isArray(procedure)) {
        const existingRes = await client.query(
          `SELECT sifraprocedure FROM ${PROCEDURA_TABLE} WHERE brojistorije = $1`,
          [brojistorije],
        );
        const existingSet = new Set(
          existingRes.rows.map((r) => r.sifraprocedure),
        );
        const incomingSet = new Set(procedure);

        for (const sifraprocedure of incomingSet) {
          if (!existingSet.has(sifraprocedure)) {
            await client.query(
              `INSERT INTO ${PROCEDURA_TABLE} (brojistorije, sifraprocedure) VALUES ($1, $2)`,
              [brojistorije, sifraprocedure],
            );
          }
        }

        for (const sifraprocedure of existingSet) {
          if (!incomingSet.has(sifraprocedure)) {
            await client.query(
              `DELETE FROM ${PROCEDURA_TABLE} WHERE brojistorije = $1 AND sifraprocedure = $2`,
              [brojistorije, sifraprocedure],
            );
          }
        }
      }

      if (Array.isArray(dijagnoze)) {
        const existingRes = await client.query(
          `SELECT sifradijagnoze FROM ${DIJAGNOZA_TABLE} WHERE brojistorije = $1`,
          [brojistorije],
        );
        const existingSet = new Set(
          existingRes.rows.map((r) => r.sifradijagnoze),
        );
        const incomingSet = new Set(dijagnoze);

        for (const sifradijagnoze of incomingSet) {
          if (!existingSet.has(sifradijagnoze)) {
            await client.query(
              `INSERT INTO ${DIJAGNOZA_TABLE} (brojistorije, sifradijagnoze) VALUES ($1, $2)`,
              [brojistorije, sifradijagnoze],
            );
          }
        }

        for (const sifradijagnoze of existingSet) {
          if (!incomingSet.has(sifradijagnoze)) {
            await client.query(
              `DELETE FROM ${DIJAGNOZA_TABLE} WHERE brojistorije = $1 AND sifradijagnoze = $2`,
              [brojistorije, sifradijagnoze],
            );
          }
        }
      }

      if (Array.isArray(stavke)) {
        for (const stavka of stavke) {
          const { brstavkeistorije, jkl, datumvreme, toknalazi, doza } = stavka;

          const existingRes = await client.query(
            `SELECT jkl, datumvreme, toknalazi, doza FROM ${STAVKA_TABLE} WHERE brstavkeistorije = $1 AND brojistorije = $2`,
            [brstavkeistorije, brojistorije],
          );

          if (existingRes.rows.length === 0) {
            await client.query(
              `INSERT INTO ${STAVKA_TABLE} 
                     (brstavkeistorije, brojistorije, jkl, datumvreme, toknalazi, doza)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                brstavkeistorije,
                brojistorije,
                jkl,
                datumvreme,
                toknalazi,
                doza,
              ],
            );
          } else {
            await client.query(
              `UPDATE ${STAVKA_TABLE} 
                     SET jkl = COALESCE($3, jkl),
                     datumvreme = COALESCE($4, datumvreme),
                     toknalazi = COALESCE($5, toknalazi),
                     doza = COALESCE($6, doza)
                     WHERE brstavkeistorije = $1 AND brojistorije = $2`,
              [
                brstavkeistorije,
                brojistorije,
                jkl || existingRes.rows[0].jkl,
                datumvreme || existingRes.rows[0].datumvreme,
                toknalazi || existingRes.rows[0].toknalazi,
                doza || existingRes.rows[0].doza,
              ],
            );
          }
        }
      }

      await client.query("COMMIT");

      return await istorijaBolestiModel.read(brojistorije);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (brojistorije) => {
    try {
      const existing = await istorijaBolestiModel.read(brojistorije);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `DELETE FROM ${DIJAGNOZA_TABLE} WHERE brojistorije = $1`,
        [brojistorije],
      );

      await client.query(
        `DELETE FROM ${PROCEDURA_TABLE} WHERE brojistorije = $1`,
        [brojistorije],
      );

      await client.query(
        `DELETE FROM ${STAVKA_TABLE} WHERE brojistorije = $1`,
        [brojistorije],
      );

      await client.query(`DELETE FROM ${TABLE} WHERE brojistorije = $1`, [
        brojistorije,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default istorijaBolestiModel;

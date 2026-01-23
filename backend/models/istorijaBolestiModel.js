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

  readAll: async (brlicenceFilter, samoZatvorene = false) => {
    const params = [];
    let query = `
    SELECT i.*,
      (SELECT COALESCE(json_agg(s.*), '[]') 
       FROM ${STAVKA_TABLE} s 
       WHERE s.brojistorije = i.brojistorije) as stavke,
      (SELECT COALESCE(json_agg(p.*), '[]') 
       FROM (
         SELECT pr.sifraprocedure, pr.naziv 
         FROM procedura pr 
         JOIN ${PROCEDURA_TABLE} pzi 
           ON pr.sifraprocedure = pzi.sifraprocedure 
         WHERE pzi.brojistorije = i.brojistorije
       ) p) as procedure,
      (SELECT COALESCE(json_agg(d.*), '[]') 
       FROM (
         SELECT di.sifradijagnoze, di.naziv, di.opis 
         FROM dijagnoza di 
         JOIN ${DIJAGNOZA_TABLE} dpi 
           ON di.sifradijagnoze = dpi.sifradijagnoze 
         WHERE dpi.brojistorije = i.brojistorije
       ) d) as dijagnoze
    FROM ${TABLE} i
    WHERE 1=1
  `;

    if (brlicenceFilter) {
      params.push(brlicenceFilter);
      if (samoZatvorene) {
        query += ` AND i.brlicencezatvorio = $${params.length}`;
      } else {
        query += ` AND (i.brlicencezatvorio IS NULL OR i.brlicencezatvorio = $${params.length})`;
      }
    }

    query += ` ORDER BY i.brojistorije`;

    const res = await client.query(query, params);
    return res.rows || [];
  },

  read: async (brojistorije) => {
    const query = `
      SELECT i.*,
        (SELECT COALESCE(json_agg(s.*), '[]') FROM ${STAVKA_TABLE} s WHERE s.brojistorije = i.brojistorije) as stavke,
        (SELECT COALESCE(json_agg(p.*), '[]') FROM (
            SELECT pr.sifraprocedure, pr.naziv FROM procedura pr 
            JOIN ${PROCEDURA_TABLE} pzi ON pr.sifraprocedure = pzi.sifraprocedure 
            WHERE pzi.brojistorije = i.brojistorije
        ) p) as procedure,
        (SELECT COALESCE(json_agg(d.*), '[]') FROM (
            SELECT di.sifradijagnoze, di.naziv, di.opis FROM dijagnoza di 
            JOIN ${DIJAGNOZA_TABLE} dpi ON di.sifradijagnoze = dpi.sifradijagnoze 
            WHERE dpi.brojistorije = i.brojistorije
        ) d) as dijagnoze
      FROM ${TABLE} i
      WHERE i.brojistorije = $1`;

    const res = await client.query(query, [brojistorije]);
    return res.rows[0] || null;
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
        `UPDATE ${TABLE} SET 
        tezinanovorodjence = COALESCE($2, tezinanovorodjence),
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
        await client.query(
          `DELETE FROM ${PROCEDURA_TABLE} WHERE brojistorije = $1 AND NOT (sifraprocedure = ANY($2))`,
          [brojistorije, procedure],
        );
        if (procedure.length > 0) {
          await client.query(
            `INSERT INTO ${PROCEDURA_TABLE} (brojistorije, sifraprocedure) 
           SELECT $1, unnest($2::text[]) ON CONFLICT DO NOTHING`,
            [brojistorije, procedure],
          );
        }
      }

      if (Array.isArray(dijagnoze)) {
        await client.query(
          `DELETE FROM ${DIJAGNOZA_TABLE} WHERE brojistorije = $1 AND NOT (sifradijagnoze = ANY($2))`,
          [brojistorije, dijagnoze],
        );
        if (dijagnoze.length > 0) {
          await client.query(
            `INSERT INTO ${DIJAGNOZA_TABLE} (brojistorije, sifradijagnoze) 
           SELECT $1, unnest($2::text[]) ON CONFLICT DO NOTHING`,
            [brojistorije, dijagnoze],
          );
        }
      }

      if (Array.isArray(stavke)) {
        const incomingIds = stavke
          .map((s) => s.brstavkeistorije)
          .filter((id) => id != null);

        await client.query(
          `DELETE FROM ${STAVKA_TABLE} WHERE brojistorije = $1 AND NOT (brstavkeistorije = ANY($2))`,
          [brojistorije, incomingIds],
        );

        if (stavke.length > 0) {
          const params = [brojistorije];
          const values = stavke
            .map((s, i) => {
              const offset = i * 5 + 2;
              const stara = existing.stavke.find(
                (ex) => ex.brstavkeistorije === s.brstavkeistorije,
              );
              params.push(
                s.brstavkeistorije,
                s.jkl || (stara ? stara.jkl : null),
                s.datumvreme || (stara ? stara.datumvreme : null),
                s.toknalazi !== undefined
                  ? s.toknalazi
                  : stara
                    ? stara.toknalazi
                    : "",
                s.doza || (stara ? stara.doza : null),
              );
              return `($${offset}, $1, $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
            })
            .join(",");

          await client.query(
            `INSERT INTO ${STAVKA_TABLE} (brstavkeistorije, brojistorije, jkl, datumvreme, toknalazi, doza)
           VALUES ${values}
           ON CONFLICT (brstavkeistorije, brojistorije) DO UPDATE SET
             jkl = EXCLUDED.jkl,
             datumvreme = EXCLUDED.datumvreme,
             toknalazi = EXCLUDED.toknalazi,
             doza = EXCLUDED.doza`,
            params,
          );
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

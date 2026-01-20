import { client } from "../db/db.js";
import { generateEmbedding } from "../helpers/embeddings.js";

const TABLE = "dijagnoza";

const dijagnozaModel = {
  create: async (data) => {
    const { sifradijagnoze, naziv, opis } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifradijagnoze, naziv, opis)
         VALUES ($1, $2, $3)`,
        [sifradijagnoze, naziv, opis],
      );

      await client.query("COMMIT");

      return await dijagnozaModel.read(sifradijagnoze);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  read: async (sifradijagnoze) => {
    const result = await client.query(
      `SELECT sifradijagnoze, naziv, opis
       FROM ${TABLE}
       WHERE sifradijagnoze = $1`,
      [sifradijagnoze],
    );

    return result.rows[0] || null;
  },

  update: async (sifradijagnoze, data) => {
    const { naziv, opis } = data;

    try {
      const existing = await dijagnozaModel.read(sifradijagnoze);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET naziv = COALESCE($2, naziv),
         opis = COALESCE($3, opis)
         WHERE sifradijagnoze = $1`,
        [sifradijagnoze, naziv, opis],
      );

      await client.query("COMMIT");

      return await dijagnozaModel.read(sifradijagnoze);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifradijagnoze) => {
    try {
      const existing = await dijagnozaModel.read(sifradijagnoze);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(`DELETE FROM ${TABLE} WHERE sifradijagnoze = $1`, [
        sifradijagnoze,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  search: async (data) => {
    const { query, limit = 2 } = data;

    try {
      const qEmb = await generateEmbedding(query);
      const vectorLiteral = "[" + qEmb.join(",") + "]";

      const dijagnoze = await client.query(
        `SELECT sifradijagnoze, naziv, opis, 1 - (embedding <=> $1::vector) AS slicnost
         FROM dijagnoza
         WHERE embedding IS NOT NULL
         ORDER BY slicnost DESC
         LIMIT $2`,
        [vectorLiteral, limit],
      );

      const dijagnozeSaLekovima = await Promise.all(
        dijagnoze.rows.map(async (dijagnoza) => {
          const lekoviRes = await client.query(
            `SELECT l.jkl, l.naziv, l.jacina, l.jedinica
	         FROM lek l
	         WHERE l.jkl IN (
    	         SELECT lsa.jkl
    		     FROM leksadrziaktivnasupstanca lsa
    		     JOIN leci lec ON lsa.atc = lec.atc
    		     WHERE lec.sifradijagnoze = $1
	         )
	         LIMIT 3;`,
            [dijagnoza.sifradijagnoze],
          );

          return {
            ...dijagnoza,
            lekovi: lekoviRes.rows,
          };
        }),
      );

      return dijagnozeSaLekovima;
    } catch (err) {
      throw err;
    }
  },
};

export default dijagnozaModel;

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

  readAll: async () => {
    const result = await client.query(
      `SELECT sifradijagnoze, naziv, opis
       FROM ${TABLE}`,
    );

    return result.rows || null;
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

      const result = await client.query(
        `SELECT 
             d.sifradijagnoze, 
             d.naziv, 
             d.opis, 
             1 - (d.embedding <=> $1::vector) AS slicnost,
             (
               SELECT COALESCE(json_agg(lekovi_sub), '[]')
               FROM (
                 SELECT l.jkl, l.naziv, l.jacina, l.jedinica
                 FROM lek l
                 WHERE l.jkl IN (
                   SELECT lsa.jkl
                   FROM leksadrziaktivnasupstanca lsa
                   JOIN leci lec ON lsa.atc = lec.atc
                   WHERE lec.sifradijagnoze = d.sifradijagnoze
                 )
                 LIMIT 3
               ) lekovi_sub
             ) AS lekovi
         FROM dijagnoza d
         WHERE d.embedding IS NOT NULL
         ORDER BY slicnost DESC
         LIMIT $2`,
        [vectorLiteral, limit],
      );

      return result.rows;
    } catch (err) {
      throw err;
    }
  },
};

export default dijagnozaModel;

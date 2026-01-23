import { client } from "../db/db.js";

const VIEW = "vw_lek_json";

const lekModel = {
  create: async (data) => {
    const result = await client.query(
      `INSERT INTO ${VIEW}(data)
       VALUES ($1)
       RETURNING data`,
      [data],
    );

    return result.rows[0]?.data || null;
  },

  readAll: async ({ forme } = {}) => {
    let sql = `SELECT data FROM ${VIEW}`;
    const params = [];

    if (forme && forme.length > 0 && forme[0]) {
      const placeholders = forme.map((_, i) => `$${i + 1}`).join(", ");
      sql += ` WHERE data->'formaleka'->>'sifraformeleka' IN (${placeholders})`;
      params.push(...forme);
    }

    const result = await client.query(sql, params);
    return result.rows.map((row) => row.data);
  },

  read: async (jkl) => {
    const result = await client.query(
      `SELECT data FROM ${VIEW} WHERE (data->>'jkl') = $1`,
      [jkl],
    );
    return result.rows[0]?.data || null;
  },

  update: async (jkl, data) => {
    const result = await client.query(
      `UPDATE ${VIEW}
       SET data = $2
       WHERE (data->>'jkl') = $1
       RETURNING data`,
      [jkl, data],
    );
    return result.rows[0]?.data || null;
  },

  delete: async (jkl) => {
    const result = await client.query(
      `DELETE FROM ${VIEW}
       WHERE (data->>'jkl') = $1
       RETURNING data`,
      [jkl],
    );
    return result.rows[0]?.data || null;
  },
};

export default lekModel;

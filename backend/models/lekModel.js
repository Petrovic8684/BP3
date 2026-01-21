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

  read: async (jkl) => {
    const result = await client.query(
      `SELECT data
       FROM ${VIEW}
       WHERE (data->'lek'->>'jkl') = $1`,
      [jkl],
    );

    return result.rows[0]?.data || null;
  },

  update: async (jkl, data) => {
    const result = await client.query(
      `UPDATE ${VIEW}
       SET data = $2
       WHERE (data->'lek'->>'jkl') = $1
       RETURNING data`,
      [jkl, data],
    );

    return result.rows[0]?.data || null;
  },

  delete: async (jkl) => {
    const result = await client.query(
      `DELETE FROM ${VIEW}
       WHERE (data->'lek'->>'jkl') = $1
       RETURNING data`,
      [jkl],
    );

    return result.rows[0]?.data || null;
  },
};

export default lekModel;

import { client } from "../db/db.js";

const TABLE = "procedura";

const proceduraModel = {
  readAll: async () => {
    const result = await client.query(
      `SELECT sifraprocedure, naziv FROM ${TABLE}`,
    );

    return result.rows || null;
  },
};

export default proceduraModel;

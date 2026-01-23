import { client } from "../db/db.js";

const TABLE = "uzrokpovrede";

const uzrokPovredeModel = {
  readAll: async () => {
    const result = await client.query(
      `SELECT sifrapovrede, naziv FROM ${TABLE}`,
    );

    return result.rows || null;
  },
};

export default uzrokPovredeModel;

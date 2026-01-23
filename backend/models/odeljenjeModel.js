import { client } from "../db/db.js";

const TABLE = "odeljenje";

const odeljenjeModel = {
  readAll: async () => {
    const result = await client.query(
      `SELECT sifraodeljenja, naziv FROM ${TABLE}`,
    );

    return result.rows || null;
  },
};

export default odeljenjeModel;

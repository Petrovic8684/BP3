import { client } from "../db/db.js";

const TABLE = "mesto";

const mestoModel = {
  readAll: async () => {
    const result = await client.query(`SELECT ppt, naziv FROM ${TABLE}`);

    return result.rows || null;
  },
};

export default mestoModel;

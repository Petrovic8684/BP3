import { client } from "../db/db.js";

const MASTER_TABLE = "pruzalacusluge";
const DETAILS_TABLE = "medicinskitehnicar";

const medicinskiTehnicarModel = {
  readAll: async () => {
    const result = await client.query(
      `SELECT m.brlicence, m.prezimeime
       FROM ${MASTER_TABLE} m
       JOIN ${DETAILS_TABLE} d USING (brlicence)`,
    );

    return result.rows || null;
  },
};

export default medicinskiTehnicarModel;

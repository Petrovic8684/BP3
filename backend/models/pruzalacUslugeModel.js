import { client } from "../db/db.js";

const TABLE = "pruzalacusluge";

const pruzalacUslugeModel = {
  read: async (brlicence) => {
    const pruzalac = await client.query(
      `SELECT brlicence, prezimeime, lozinka
       FROM ${TABLE}
       WHERE brlicence = $1`,
      [brlicence],
    );

    return pruzalac.rows[0] || null;
  },
};

export default pruzalacUslugeModel;

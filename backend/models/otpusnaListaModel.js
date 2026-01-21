import { client } from "../db/db.js";

const TABLE = "otpusnalista";

const otpusnaListaModel = {
  create: async (data) => {
    const {
      sifraotpustneliste,
      predlog,
      epikriza,
      datumvreme,
      lecenod,
      lecendo,
      brojistorije,
      sifradijagnozekonacna,
    } = data;

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ${TABLE} (sifraotpustneliste, predlog, epikriza, datumvreme, lecenod, lecendo, brojistorije, sifradijagnozekonacna)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          sifraotpustneliste,
          predlog,
          epikriza,
          datumvreme,
          lecenod,
          lecendo,
          brojistorije,
          sifradijagnozekonacna,
        ],
      );

      await client.query("COMMIT");

      return await otpusnaListaModel.read(sifraotpustneliste);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  readAll: async () => {
    const result = await client.query(
      `SELECT sifraotpustneliste, predlog, epikriza, datumvreme, lecenod, lecendo, brojistorije, sifradijagnozekonacna, jmbg
       FROM ${TABLE}`,
    );

    return result.rows || null;
  },

  read: async (sifraotpustneliste) => {
    const result = await client.query(
      `SELECT sifraotpustneliste, predlog, epikriza, datumvreme, lecenod, lecendo, brojistorije, sifradijagnozekonacna, jmbg
       FROM ${TABLE}
       WHERE sifraotpustneliste = $1`,
      [sifraotpustneliste],
    );

    return result.rows[0] || null;
  },

  update: async (sifraotpustneliste, data) => {
    const {
      predlog,
      epikriza,
      datumvreme,
      lecenod,
      lecendo,
      brojistorije,
      sifradijagnozekonacna,
    } = data;

    try {
      const existing = await otpusnaListaModel.read(sifraotpustneliste);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(
        `UPDATE ${TABLE}
         SET predlog = COALESCE($2, predlog),
         epikriza = COALESCE($3, epikriza),
         datumvreme = COALESCE($4, datumvreme),
         lecenod = COALESCE($5, lecenod),
         lecendo = COALESCE($6, lecendo),
         brojistorije = COALESCE($7, brojistorije),
         sifradijagnozekonacna = COALESCE($8, sifradijagnozekonacna)
         WHERE sifraotpustneliste = $1`,
        [
          sifraotpustneliste,
          predlog,
          epikriza,
          datumvreme,
          lecenod,
          lecendo,
          brojistorije,
          sifradijagnozekonacna,
        ],
      );

      await client.query("COMMIT");

      return await otpusnaListaModel.read(sifraotpustneliste);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },

  delete: async (sifraotpustneliste) => {
    try {
      const existing = await otpusnaListaModel.read(sifraotpustneliste);
      if (!existing) return null;

      await client.query("BEGIN");

      await client.query(`DELETE FROM ${TABLE} WHERE sifraotpustneliste = $1`, [
        sifraotpustneliste,
      ]);

      await client.query("COMMIT");

      return existing;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default otpusnaListaModel;

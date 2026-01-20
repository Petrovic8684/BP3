import { client } from "../db/db.js";

const vrstaOtpustaModel = {
  readAll: async () => {
    const result = await client.query(
      "SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conname = 'chk_istorija_vrstaot_allowed';",
    );

    if (!result.rows[0]) return [];

    const def = result.rows[0].definition;

    const arrayMatch = def.match(/ARRAY\[(.*)\]\)/s);
    if (!arrayMatch) return [];

    const items = arrayMatch[1]
      .split(/\s*,\s*/)
      .map((s) => s.replace(/::.*$/, ""))
      .map((s) => s.replace(/^'|'$/g, ""))
      .map((s) => s.trim());

    return items;
  },

  update: async (data) => {
    const { vrednosti } = data;

    try {
      await client.query("BEGIN");
      await client.query(`CALL proc_update_allowed_vrsteot($1::text[])`, [
        vrednosti,
      ]);
      await client.query("COMMIT");

      return await vrstaOtpustaModel.readAll();
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  },
};

export default vrstaOtpustaModel;

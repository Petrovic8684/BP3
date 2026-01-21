import cron from "node-cron";
import { client } from "../db/db.js";

const schedulePartitionCreation = async () => {
  console.log(
    "[helpers/schedule.js] Cron posao za kreiranje particija zakazan\n",
  );

  cron.schedule("1 0 1 1 *", async () => {
    try {
      console.log(
        "[helpers/schedule.js] Kreiram novu particiju za tabelu otpusnalista...",
      );

      await client.query("BEGIN");
      await client.query(
        "CALL proc_create_otpusna_partition_for_current_year()",
      );
      await client.query("COMMIT");

      console.log(
        "[helpers/schedule.js] Uspelo kreiranje particije za tabelu otpusnalista\n",
      );
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(
        `[helpers/schedule.js] Neuspelo kreiranje particije za tabelu otpusnalista: `,
        error,
      );
    }
  });
};

export default schedulePartitionCreation;

import schedule from "node-schedule";
import { sendRecommand } from "controller/recommand";

schedule.scheduleJob("0 20 11 * * 1-5", async () => {
  console.log("schedule job ###");
  await sendRecommand();
});

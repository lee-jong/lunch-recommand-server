import schedule from "node-schedule";
import { sendRecommand } from "controller/recommand";

schedule.scheduleJob("0 0 14 * * *", async () => {
  sendRecommand();
});

import cron from "node-cron";
import User from "../models/user.model.js";
import { getStartOfDayInUserTimezoneUTC } from "./utils.js";

export const scheduleDailyHabitJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const users = await User.find();

      for (const user of users) {
        const timezone = user.timezone;

        if (timezone) {
          const nowUtc = new Date();
          const yesterdayUtc = new Date(nowUtc);
          yesterdayUtc.setDate(nowUtc.getDate() - 1);

          const startOfYesterdayUserTime = getStartOfDayInUserTimezoneUTC(
            yesterdayUtc,
            timezone
          );

          const existingEntry = user.dailyHabits.find(
            (habit) =>
              habit.date.getTime() === startOfYesterdayUserTime.getTime()
          );

          if (!existingEntry) {
            user.dailyHabits.push({
              date: startOfYesterdayUserTime,
              goodCount: 0,
              badCount: 0,
            });

            await user.save();
          }
        }
      }
      console.log("Daily habit check completed");
    } catch (err) {
      console.log("Error in scheduleDailyHabitJob cronJobs:", err);
    }
  });
};

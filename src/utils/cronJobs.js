import { Habit } from "../models/habits.model.js";
import { User } from "../models/user.model.js";
import mailSender from "./mailSender.js";

export const sendHabitReminders = async () => {
  try {
    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    const currentTime = new Date().toTimeString().slice(0, 5);

    const habitsToRemind = await Habit.find({
      dailyReminder: true,
      reminderTime: currentTime,
      selectedDays: currentDay,
    });

    for (const habit of habitsToRemind) {
      const user = await User.findById(habit.userId);

      if (user && user.email) {
        const emailSubject = `Reminder for your habit: ${habit.title}`;
        const emailBody = `<p>This is a reminder to perform your habit "${habit.title}" at ${habit.reminderTime}. Keep up the good work!</p>`;

        await mailSender(user.email, emailSubject, emailBody);
      }
    }
  } catch (error) {
    console.error("Error sending habit reminders:", error);
  }
};

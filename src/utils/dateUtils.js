import moment from "moment";

export const getWeekTimeline = () => {
  const today = moment().startOf("day");
  const dayOfWeek = today.isoWeekday(); // ISO weekday: 1 (Monday) to 7 (Sunday)
  const startOfWeek = today.clone().subtract(dayOfWeek - 1, "days");
  const endOfWeek = startOfWeek.clone().add(6, "days");

  return {
    startOfWeek: startOfWeek.toDate(),
    endOfWeek: endOfWeek.toDate(),
  };
};

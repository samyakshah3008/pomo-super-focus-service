export const getYesterdayDateRange = () => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  return { startOfYesterday, endOfYesterday: startOfToday };
};

export const formatDate = (date) => date.toISOString().split("T")[0];

export const getEOD = (date) => {
  const currentDateObj = new Date(date);
  let endOfCurrentDate = new Date(currentDateObj);
  return endOfCurrentDate.setHours(23, 59, 59, 999);
};

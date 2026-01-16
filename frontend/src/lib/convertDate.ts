export const convertDate = (date: string) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleDateString("en-NZ", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const convertTimeAndDate = (date: string) => {
  const dateObj = new Date(date);

  return dateObj
    .toLocaleDateString("en-NZ", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");
};

export const convertOnlyTime = (date: string) => {
  const dateObj = new Date(date);

  return dateObj.toLocaleTimeString("en-NZ", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const formatDateSeparator = (date: string) => {
  const dateObj = new Date(date);
  const now = new Date();

  const isToday = dateObj.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = dateObj.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return dateObj.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

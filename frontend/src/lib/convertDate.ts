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

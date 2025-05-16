export const formatDateTime = (
  isoString: any,
  formatType: "date" | "time" | "full" | "month-year" | "year" = "full"
): string => {
  const dateObj = new Date(isoString);

  // Lấy ngày, tháng, năm theo local timezone
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  // Lấy giờ, phút theo local timezone
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;
  const formattedMonthYear = `${month}/${year}`;
  const formattedYear = `${year}`;

  if (formatType === "date") return formattedDate;
  if (formatType === "time") return formattedTime;
  if (formatType === "month-year") return formattedMonthYear;
  if (formatType === "year") return formattedYear;

  return `${formattedDate} - ${formattedTime}`;
};

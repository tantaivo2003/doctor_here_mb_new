export const formatDateTime = (
  isoString: string,
  formatType: "date" | "time" | "full" = "full"
): string => {
  const dateObj = new Date(isoString);

  // Lấy ngày, tháng, năm
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = dateObj.getUTCFullYear();

  // Lấy giờ, phút
  let hours = dateObj.getUTCHours();
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Chuyển đổi sang định dạng 12 giờ
  hours = hours % 12 || 12;

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  if (formatType === "date") return formattedDate;
  if (formatType === "time") return formattedTime;
  return `${formattedDate} - ${formattedTime}`;
};

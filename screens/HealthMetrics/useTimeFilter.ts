import { useState } from "react";

export const useTimeFilter = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getStartEndDate = (displayOption: string) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();

    let startDate: Date;
    let endDate: Date;

    if (displayOption === "Tuần") {
      // Tính ngày đầu tuần (Thứ 2) và cuối tuần (Chủ nhật)
      const day = currentDate.getDay(); // Chủ nhật = 0
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startDate = new Date(currentDate);
      startDate.setDate(date + diffToMonday);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (displayOption === "Tháng") {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    }

    return { startDate, endDate };
  };

  const handleChange = (
    direction: "prev" | "next",
    type: "week" | "month" | "year"
  ) => {
    const newDate = new Date(currentDate);

    if (type === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    }else {
      newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1));
    }

    setCurrentDate(newDate);
  };

  return {
    currentDate,
    setCurrentDate,
    getStartEndDate,
    handleChange,
  };
};

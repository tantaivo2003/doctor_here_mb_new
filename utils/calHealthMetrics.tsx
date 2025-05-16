import { HealthRecord } from "../types/types";

export const calculateBMI = (heightM: number, weightKg: number) => {
  if (heightM <= 0 || weightKg <= 0) {
    return 0;
  }

  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  return bmi;
};

export const calculateBMIRecords = (
  heightRecords: HealthRecord[],
  weightRecords: HealthRecord[]
): HealthRecord[] => {
  const parseDateSmart = (dateStr: string): Date => {
    if (/^\d{4}$/.test(dateStr)) {
      return new Date(`${dateStr}-01-01`);
    } else if (/^\d{4}-\d{2}$/.test(dateStr)) {
      return new Date(`${dateStr}-01`);
    } else {
      return new Date(dateStr);
    }
  };

  const sortedHeights = [...heightRecords].sort(
    (a, b) =>
      parseDateSmart(a.date).getTime() - parseDateSmart(b.date).getTime()
  );

  return weightRecords.map((weight) => {
    const weightDate = parseDateSmart(weight.date);

    const matchedHeight = [...sortedHeights]
      .reverse()
      .find((h) => parseDateSmart(h.date).getTime() <= weightDate.getTime());

    const heightM = matchedHeight ? matchedHeight.value / 100 : 0;
    const weightKg = weight.value;
    const bmiValue = calculateBMI(heightM, weightKg);

    return {
      date: weight.date,
      value: bmiValue,
    };
  });
};

export const getBMIStatus = (bmi: number) => {
  if (bmi < 18.5) {
    return {
      color: "bg-blue-200",
      textColor: "text-blue-800",
      advice: "Bạn đang thiếu cân, hãy ăn uống đầy đủ hơn!",
    };
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return {
      color: "bg-green-200",
      textColor: "text-green-800",
      advice:
        "Bạn có cân nặng lý tưởng! Hãy duy trì chế độ ăn uống và tập luyện.",
    };
  } else if (bmi >= 25 && bmi < 29.9) {
    return {
      color: "bg-yellow-200",
      textColor: "text-yellow-800",
      advice:
        "Bạn đang thừa cân, nên điều chỉnh chế độ ăn uống và tập thể dục.",
    };
  } else {
    return {
      color: "bg-red-200",
      textColor: "text-red-800",
      advice:
        "Bạn đang béo phì, hãy tham khảo ý kiến bác sĩ để có chế độ giảm cân phù hợp!",
    };
  }
};

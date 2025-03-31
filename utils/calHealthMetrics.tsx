export const calculateBMI = (heightCm: number, weightKg: number) => {
  if (heightCm <= 0 || weightKg <= 0) {
    return 0;
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  console.log("BMI = ", weightKg, heightM);
  return bmi;
};

{
  /* Xác định màu sắc và lời khuyên dựa trên BMI */
}
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

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
export interface DiabetesPredictRequest {
  smoking_history: string;
  HbA1c_level: number;
}

export const predictDiabetes = async (
  ptID: string,
  data: DiabetesPredictRequest
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/predict/diabetes/${ptID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi server: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn("Lỗi khi gọi API dự đoán tiểu đường:", error);
    throw error;
  }
};

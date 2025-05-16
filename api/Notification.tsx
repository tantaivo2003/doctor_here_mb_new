const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export async function savePushToken(userID: string, token: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/user/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lưu push token:", error);
    throw error;
  }
}

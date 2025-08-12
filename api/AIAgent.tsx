const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

interface MsgToAI {
  cuoc_hoi_thoai: string;
  ben_gui_di: string;
  kieu_noi_dung: string;
  noi_dung_van_ban: string;
  media_url: string;
  thoi_diem_gui: string;
}
export const createAIConversation = async (drID: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversation/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        drID,
      }),
    });

    if (!response.ok) {
      throw new Error("Không thể tạo cuộc trò chuyện");
    }

    const data = await response.json();
    return data; // chứa { id, ma_benh_nhan, ma_bac_si, ... }
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    return null;
  }
};

export const saveMessageToDB = async (msg: MsgToAI) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/message/text/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...msg,
      }),
    });

    if (!response.ok) {
      throw new Error("Không thể tạo cuộc trò chuyện");
    }

    const data = await response.json();
    return data; // chứa { id, ma_benh_nhan, ma_bac_si, ... }
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    return null;
  }
};

export const sendMsgToAI = async (
  ma_user: string,
  message: string,
  role: string
) => {
  try {
    console.log("Sending message to LLM handle");
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ma_user,
        message,
        role,
      }),
    });

    if (!response.ok) {
      throw new Error("Không thể tạo cuộc trò chuyện");
    }

    const data = await response.json();
    console.log("Response from LLM handle:", data);
    return data; // chứa { id, ma_benh_nhan, ma_bac_si, ... }
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    return null;
  }
};

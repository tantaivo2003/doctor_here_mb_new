const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
import { messagesList, Message } from "../types/types";

export const createConversation = async (ptID: string, drID: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/conversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ptID,
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

export const getConversationByDoctorAndPatient = async (
  doctorID: string,
  patientID: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/coversation/doctor/${doctorID}/patient/${patientID}`
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }

    return {
      id: data.id,
      doctorID: data.ma_bac_si,
      patientID: data.ma_benh_nhan,
      createdAt: data.thoi_diem_tao,
      lastMessageAt: data.thoi_diem_tin_nhan_cuoi,
    };
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }
};

export const fetchMessagesByConversationID = async (convID: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/message/conversation/${convID}`
    );
    if (!response.ok) throw new Error("Không thể lấy tin nhắn");
    const data = await response.json();

    const formattedData: Message[] = data.map((item: any) => ({
      id: item.id,
      sender: item.ben_gui_di,
      type: item.kieu_noi_dung,
      content:
        item.kieu_noi_dung === "text" ? item.noi_dung_van_ban : item.media_url,
      timestamp: item.thoi_diem_gui,
    }));

    return formattedData;
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return [];
  }
};

export const markMessagesAsSeen = async (convID: string, userID: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/message/seen/conversation/${convID}/user/${userID}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("Đánh dấu tin nhắn là đã xem thất bại");
    }

    console.log("Đánh dấu tin nhắn là đã xem thành công");
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã xem:", error);
  }
};

export const uploadMessageFiles = async (files: any[]): Promise<any[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folderName", "message_media");

    const res = await fetch(`${API_BASE_URL}/api/cloud/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload file thất bại");
    return await res.json(); // Trả về mảng [{ url, type }, ...]
  } catch (error) {
    console.error("Lỗi khi upload file:", error);
    return [];
  }
};

export const sendMessageToServer = async (
  senderID: string,
  receiverID: string,
  content: string,
  timestamp: string,
  type: string,
  mediaUrl: string
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderID,
        receiverID,
        content,
        timestamp,
        type,
        mediaUrl,
      }),
    });

    if (!res.ok) throw new Error("Gửi tin nhắn thất bại");
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    return null;
  }
};

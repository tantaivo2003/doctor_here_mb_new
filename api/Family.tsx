import { familyMembers, mockPendingInvites } from "../types/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export const fetchFamilyMembers = async (ptID: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/relative/patient/${ptID}`
    );

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const data = await response.json();
    // return data;
    return familyMembers;
  } catch (error) {
    console.error("Lỗi khi gọi API fetchFamilyMembers:", error);
    throw error;
  }
};

// Hàm gọi API lấy danh sách mối quan hệ chưa được xác nhận
export const fetchPendingInvites = async (ptID: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/relative/pending/${ptID}`
    );

    if (!response.ok) {
      throw new Error("Lỗi khi lấy danh sách mối quan hệ chưa được xác nhận");
    }
    const data = await response.json();
    // return data;
    return mockPendingInvites;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

export const updateRelationship = async (
  ptID1: string,
  ptID2: string,
  newRelationship: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ralative/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ptID1,
        ptID2,
        newRelationship,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Đã xảy ra lỗi khi cập nhật mối quan hệ.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Không thể kết nối tới máy chủ.");
  }
};

export const confirmRelationship = async (ptID1: string, ptID2: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ralative/confirm`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ptID1,
        ptID2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Xác nhận mối quan hệ thất bại.");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Không thể kết nối đến máy chủ.");
  }
};

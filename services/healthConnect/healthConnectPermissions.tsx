import {
  requestPermission,
  getGrantedPermissions,
  Permission,
  revokeAllPermissions,
} from "react-native-health-connect";

import Toast from "react-native-toast-message";
import { permissionsToRequest, allPermissions } from "./permissions";

export const requestAllPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission(allPermissions);
    console.log("Granted Permissions:", grantedPermissions);
  } catch (error) {
    console.error("Permission request error:", error);
  }
};

export const checkAndRequestPermissions = async (
  requiredPermissions: Permission[]
): Promise<boolean> => {
  try {
    const grantedPermissions = await getGrantedPermissions();

    const missingPermissions = requiredPermissions.filter((permission) => {
      return !grantedPermissions.some(
        (granted) =>
          granted.accessType === permission.accessType &&
          granted.recordType === permission.recordType
      );
    });

    if (missingPermissions.length === 0) {
      return true; // đã đủ quyền
    }

    const newlyGranted = await requestPermission(missingPermissions);

    const stillMissing = missingPermissions.filter((permission) => {
      return !newlyGranted.some(
        (granted) =>
          granted.accessType === permission.accessType &&
          granted.recordType === permission.recordType
      );
    });

    if (stillMissing.length > 0) {
      Toast.show({
        type: "error",
        text1: "Cấp quyền không thành công",
        text2: "Vui lòng cấp quyền để sử dụng tính năng này.",
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền:", error);
    Toast.show({
      type: "error",
      text1: "Cấp quyền không thành công",
      text2: "Vui lòng cấp quyền để sử dụng tính năng này.",
    });
    return false;
  }
};
export const requestMyAppPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission(permissionsToRequest);

    const grantedCount = grantedPermissions.length;
    if (grantedCount === 0) {
      Toast.show({
        type: "error",
        text1: "Cấp quyền không thành công",
        text2: "Vui lòng cấp quyền để sử dụng tính năng này.",
      });
      return false;
    } else {
      console.log("Granted permissions:", grantedPermissions);
      return true;
    }
  } catch (error) {
    console.error("Lỗi khi yêu cầu cấp quyền:", error);
    Toast.show({
      type: "error",
      text1: "Cấp quyền không thành công",
      text2: "Vui lòng cấp quyền để sử dụng tính năng này.",
    });
    return false;
  }
};

export const readGrantedPermissions = () => {
  getGrantedPermissions().then((permissions) => {
    console.log("Granted permissions ", { permissions });
  });
};

export const revokePermissions = () => {
  console.log("Revoke permissions");
  revokeAllPermissions()
    .then(() => {
      console.log("All permissions revoked");
    })
    .catch((error) => {
      console.error("Error revoking permissions: ", error);
    });
};

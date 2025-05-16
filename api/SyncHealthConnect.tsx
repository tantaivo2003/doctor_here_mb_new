import {
  fetchHealthRecords,
  getActivityRecord,
} from "../utils/readHealthRecords";
import {
  postSimpleMetric,
  postBloodPressure,
  updateInitialSyncStatus,
} from "./HealthMetrics";
import {
  getUserID,
  getLastSyncedActivity,
  setLastSyncedActivity,
} from "../services/storage";
import { insertHealthRecord } from "../utils/insertHealthRecord";
import moment from "moment";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

export const performInitialSync = async () => {
  try {
    const userId = await getUserID();
    if (!userId) throw new Error("Không tìm thấy userId");

    const now = new Date();
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(now.getFullYear() - 3);

    const startISO = threeYearsAgo.toISOString();
    const endISO = now.toISOString();

    console.log("⏳ Bắt đầu đồng bộ từ", startISO, "đến", endISO);

    // Đồng bộ chiều cao
    const heightData = await fetchHealthRecords("Height", startISO, endISO);
    if (heightData) {
      for (const item of heightData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "height", item.value * 100, item.date);
        }
      }
    }

    // Đồng bộ cân nặng
    const weightData = await fetchHealthRecords("Weight", startISO, endISO);
    if (weightData) {
      for (const item of weightData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "weight", item.value, item.date);
        }
      }
    }
    // Đồng bộ nhịp tim
    const heartRateData = await fetchHealthRecords(
      "HeartRate",
      startISO,
      endISO
    );
    if (heartRateData) {
      for (const item of heartRateData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "heartbeat", item.value, item.date);
        }
      }
    }

    // Đồng bộ nhịp thở
    const breathData = await fetchHealthRecords(
      "RespiratoryRate",
      startISO,
      endISO
    );
    if (breathData) {
      for (const item of breathData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "breath", item.value, item.date);
        }
      }
    }
    // Đồng bộ độ bão hòa oxy
    const oxygenSaturationData = await fetchHealthRecords(
      "OxygenSaturation",
      startISO,
      endISO
    );
    if (oxygenSaturationData) {
      for (const item of oxygenSaturationData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "blood_oxygen", item.value, item.date);
        }
      }
    }

    // Đồng bộ đường huyết
    const glucoseData = await fetchHealthRecords(
      "BloodGlucose",
      startISO,
      endISO
    );
    if (glucoseData) {
      for (const item of glucoseData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "blood_sugar", item.value, item.date);
        }
      }
    }
    // Đồng bộ huyết áp
    const bloodPressureData = await fetchHealthRecords(
      "BloodPressure",
      startISO,
      endISO
    );
    if (bloodPressureData) {
      let successCount = 0;
      let errorCount = 0;

      for (const item of bloodPressureData) {
        const { systolic, diastolic, date } = item;

        // Kiểm tra hợp lệ
        if (systolic != null && diastolic != null) {
          try {
            await postBloodPressure(userId, systolic, diastolic, date);
            successCount++;
          } catch (err) {
            console.warn("⚠️ Bỏ qua lỗi huyết áp tại", date, ":", err);
            errorCount++;
          }
        }
      }

      console.log(
        `✅ BloodPressure sync: ${successCount} thành công, ${errorCount} lỗi`
      );
    }
    const stepsData = await getActivityRecord(
      "Steps",
      startISO,
      endISO,
      "DAYS"
    );

    for (const item of stepsData) {
      try {
        if (item.value === 0) continue;
        await postSimpleMetric(userId, "steps", item.value, item.date);
      } catch (err) {
        console.warn("⚠️ Bỏ qua lỗi steps:", err);
      }
    }

    const distanceData = await getActivityRecord(
      "Distance",
      startISO,
      endISO,
      "DAYS"
    );
    for (const item of distanceData) {
      try {
        if (item.value === 0) continue;
        await postSimpleMetric(userId, "distance", item.value, item.date);
      } catch (err) {
        console.warn("⚠️ Bỏ qua lỗi distance:", err);
      }
    }
    // Cập nhật biến động trạng thái đồng bộ lần đầu
    const updated = await updateInitialSyncStatus(userId);
    if (updated) {
      console.log("🎉 Đã cập nhật trạng thái đồng bộ ban đầu cho bệnh nhân");
    } else {
      console.warn("⚠️ Không thể cập nhật trạng thái đồng bộ");
    }
    console.log("✅ Đồng bộ dữ liệu thành công");
    // ✅ Lưu timestamp mới sau khi đồng bộ thành công
    await setLastSyncedActivity(now.toISOString());
    return true;
  } catch (err) {
    console.warn("❌ Lỗi khi đồng bộ dữ liệu:", err);
    return false;
  }
};

export const dailySync = async () => {
  try {
    const userId = await getUserID();

    const glucoDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(glucoDate.getDate() - 1);
    // await insertHealthRecord(
    //   "OxygenSaturation",
    //   "97.5",
    //   glucoDate.toISOString()
    // );

    // const gluco = await fetchHealthRecords(
    //   "OxygenSaturation",
    //   yesterday.toISOString(),
    //   glucoDate.toISOString()
    // );
    // console.log("Gluco", gluco);

    if (!userId) throw new Error("Không tìm thấy userId");

    const lastSynced = await getLastSyncedActivity();
    const now = new Date();

    if (lastSynced) {
      const lastSyncTime = new Date(lastSynced);
      const diff = now.getTime() - lastSyncTime.getTime();
      if (diff < FIFTEEN_MINUTES_MS) {
        console.log("⏸ Đồng bộ bị bỏ qua - Chưa đủ 15 phút kể từ lần trước.");
        return lastSyncTime;
      }
    }

    let startDate: Date;
    if (lastSynced) {
      startDate = new Date(lastSynced);
    } else {
      // Nếu chưa có lần đồng bộ nào, nhưng đã đồng bộ lần đầu
      await setLastSyncedActivity(now.toISOString());
      return now.toISOString();
    }

    const startISO = startDate.toISOString();
    const endISO = now.toISOString();

    console.log("⏳ Bắt đầu đồng bộ từ", startISO, "đến", endISO);

    // Đồng bộ chiều cao
    const heightData = await fetchHealthRecords("Height", startISO, endISO);
    if (heightData) {
      for (const item of heightData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "height", item.value * 100, item.date);
        }
      }
    }

    // Đồng bộ cân nặng
    const weightData = await fetchHealthRecords("Weight", startISO, endISO);
    if (weightData) {
      for (const item of weightData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "weight", item.value, item.date);
        }
      }
    }

    // Nhịp tim
    const heartRateData = await fetchHealthRecords(
      "HeartRate",
      startISO,
      endISO
    );
    if (heartRateData) {
      for (const item of heartRateData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "heartbeat", item.value, item.date);
        }
      }
    }

    // Nhịp thở
    const breathData = await fetchHealthRecords(
      "RespiratoryRate",
      startISO,
      endISO
    );
    if (breathData) {
      for (const item of breathData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "breath", item.value, item.date);
        }
      }
    }
    // Đồng bộ độ bão hòa oxy
    const oxygenSaturationData = await fetchHealthRecords(
      "OxygenSaturation",
      startISO,
      endISO
    );
    if (oxygenSaturationData) {
      for (const item of oxygenSaturationData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "blood_oxygen", item.value, item.date);
        }
      }
    }

    // Đồng bộ đường huyết
    const glucoseData = await fetchHealthRecords(
      "BloodGlucose",
      startISO,
      endISO
    );
    if (glucoseData) {
      for (const item of glucoseData) {
        if (item.value != null) {
          await postSimpleMetric(userId, "blood_sugar", item.value, item.date);
        }
      }
    }
    // Huyết áp
    const bloodPressureData = await fetchHealthRecords(
      "BloodPressure",
      startISO,
      endISO
    );
    if (bloodPressureData) {
      let successCount = 0;
      let errorCount = 0;
      for (const item of bloodPressureData) {
        const { systolic, diastolic, date } = item;
        if (systolic != null && diastolic != null) {
          try {
            await postBloodPressure(userId, systolic, diastolic, date);
            successCount++;
          } catch (err) {
            console.warn("⚠️ Bỏ qua lỗi huyết áp tại", date, ":", err);
            errorCount++;
          }
        }
      }
      console.log(
        `✅ BloodPressure sync: ${successCount} thành công, ${errorCount} lỗi`
      );
    }

    const stepsData = await fetchHealthRecords("Steps", startISO, endISO);
    if (stepsData) {
      for (const item of stepsData) {
        try {
          if (item.value === 0) continue;
          await postSimpleMetric(userId, "steps", item.value, item.date);
        } catch (err) {
          console.warn("⚠️ Bỏ qua lỗi steps:", err);
        }
      }
    }

    const distanceData = await fetchHealthRecords("Distance", startISO, endISO);
    if (distanceData) {
      for (const item of distanceData) {
        try {
          if (item.value === 0) continue;
          await postSimpleMetric(userId, "distance", item.value, item.date);
        } catch (err) {
          console.warn("⚠️ Bỏ qua lỗi distance:", err);
        }
      }
    }

    // ✅ Lưu timestamp mới sau khi đồng bộ thành công
    await setLastSyncedActivity(now.toISOString());

    console.log("✅ Đồng bộ dữ liệu thành công");
    return now.toISOString();
  } catch (err) {
    console.warn("❌ Lỗi khi đồng bộ dữ liệu:", err);
    return null;
  }
};

import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";

interface BloodPressureData {
  date: string;
  systolic: number;
  diastolic: number;
}

interface HealthMetricsDoubleLineChartProps {
  bloodPressureData: BloodPressureData[];
}

const mapWeekdayShort = (weekday: string) => {
  switch (weekday) {
    case "Monday":
      return "Thứ 2";
    case "Tuesday":
      return "Thứ 3";
    case "Wednesday":
      return "Thứ 4";
    case "Thursday":
      return "Thứ 5";
    case "Friday":
      return "Thứ 6";
    case "Saturday":
      return "Thứ 7";
    case "Sunday":
      return "Chủ nhật";
    default:
      return weekday;
  }
};

const formatLabel = (date: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    // Định dạng YYYY-MM-DD => DD/MM
    const weekday = moment(date, "YYYY-MM-DD").locale("vi").format("dddd");
    return mapWeekdayShort(weekday);
  } else if (/^\d{4}-\d{2}$/.test(date)) {
    // Định dạng YYYY-MM => MM
    return moment(date, "YYYY-MM").format("MM");
  } else if (/^\d{4}$/.test(date)) {
    // Định dạng YYYY => YYYY
    return date;
  } else {
    return date; // fallback, giữ nguyên
  }
};

const HealthMetricsDoubleLineChart: React.FC<
  HealthMetricsDoubleLineChartProps
> = ({ bloodPressureData }) => {
  if (!bloodPressureData || bloodPressureData.length === 0) {
    return (
      <View className="items-center justify-center my-10">
        <Text className="text-gray-500">Không có dữ liệu</Text>
      </View>
    );
  }

  const scrollViewRef = useRef<ScrollView>(null);

  const labels = bloodPressureData.map((item) => formatLabel(item.date));
  const systolicValues = bloodPressureData.map((item) => item.systolic);
  const diastolicValues = bloodPressureData.map((item) => item.diastolic);

  const chartWidth = Math.max(
    Dimensions.get("window").width,
    labels.length * 60
  );

  useEffect(() => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  }, []);

  return (
    <ScrollView horizontal ref={scrollViewRef}>
      <View>
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: systolicValues,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // đỏ - tâm thu
                strokeWidth: 2,
              },
              {
                data: diastolicValues,
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // xanh - tâm trương
                strokeWidth: 2,
              },
            ],
            legend: ["Tâm thu", "Tâm trương"],
          }}
          width={chartWidth}
          height={300}
          fromZero={true}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "#F5F5F5",
            backgroundGradientTo: "#F5F5F5",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#000",
            },
          }}
          bezier
          style={{
            marginVertical: 16,
            borderRadius: 8,
          }}
          renderDotContent={({ x, y, indexData, index }) => (
            <View
              key={`${x}-${y}-${index}`}
              style={{
                position: "absolute",
                left: x + 10,
                top: y + 20,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: 6,
                paddingVertical: 2,
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                {indexData.toFixed(1)}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default HealthMetricsDoubleLineChart;

import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { Svg, Text as SvgText } from "react-native-svg";

interface HealthMetricsLineChartProps {
  healthMetricsLineData: { date: string; value: number }[];
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
    return moment(date, "YYYY-MM").format("MM/YYYY");
  } else if (/^\d{4}$/.test(date)) {
    // Định dạng YYYY => YYYY
    return date;
  } else {
    return date; // fallback, giữ nguyên
  }
};

const HealthMetricsLineChart: React.FC<HealthMetricsLineChartProps> = ({
  healthMetricsLineData,
}) => {
  if (!healthMetricsLineData || healthMetricsLineData.length === 0) {
    return (
      <View className="items-center justify-center my-10">
        <Text className="text-gray-500">Không có dữ liệu</Text>
      </View>
    );
  }

  const scrollViewRef = useRef<ScrollView>(null);

  // Sử dụng trực tiếp dữ liệu đã được xử lý bên ngoài
  const labels = healthMetricsLineData.map(({ date }) => formatLabel(date));
  const values = healthMetricsLineData.map(({ value }) => value);

  const chartWidth = Math.max(
    Dimensions.get("window").width,
    labels.length * 50
  );

  // 🔹 Cuộn sang phải khi render xong
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
          data={{ labels, datasets: [{ data: values }] }}
          width={chartWidth}
          height={300}
          fromZero={true}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "#F5F5F5",
            backgroundGradientTo: "#F5F5F5",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#007AFF",
            },
          }}
          style={{
            marginVertical: 16,
            borderRadius: 8,
          }}
          bezier
          onDataPointClick={(data) => {
            console.log("Tọa độ điểm đã click:", data.x, data.y);
            console.log("Giá trị điểm:", data.value);
            console.log("Index điểm:", data.index);
          }}
          renderDotContent={({ x, y, index, indexData }) => (
            <View
              key={index}
              style={{
                position: "absolute",
                left: x + 10,
                top: y - 18,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: 6,
                paddingVertical: 2,
                paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 10 }}>
                {indexData.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};

export default HealthMetricsLineChart;

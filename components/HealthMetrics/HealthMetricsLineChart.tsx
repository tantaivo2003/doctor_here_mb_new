import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { Svg, Text as SvgText } from "react-native-svg";

interface HealthMetricsLineChartProps {
  healthMetricsLineData: { date: string; value: number }[];
}

const HealthMetricsLineChart: React.FC<HealthMetricsLineChartProps> = ({
  healthMetricsLineData,
}) => {
  if (!healthMetricsLineData || healthMetricsLineData.length === 0) {
    return (
      <View className="items-center justify-center">
        <Text className="text-gray-500">Không có dữ liệu</Text>
      </View>
    );
  }

  const scrollViewRef = useRef<ScrollView>(null);

  // Xử lý dữ liệu: Tính trung bình nếu một ngày có nhiều giá trị
  const groupedData: Record<string, number[]> = {};
  healthMetricsLineData.forEach(({ date, value }) => {
    const formattedDate = moment(date).format("DD-MM");
    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = [];
    }
    groupedData[formattedDate].push(value);
  });

  const labels = Object.keys(groupedData);
  const values = labels.map(
    (date) =>
      groupedData[date].reduce((sum, val) => sum + val, 0) /
      groupedData[date].length
  );

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
    }, 100); // Delay nhẹ để tránh lỗi render
  }, []);
  return (
    <ScrollView horizontal ref={scrollViewRef}>
      <View>
        <LineChart
          data={{ labels, datasets: [{ data: values }] }}
          width={chartWidth}
          height={250}
          fromZero={true}
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundGradientFrom: "#F5F5F5", // Xám nhạt phía trên
            backgroundGradientTo: "#F5F5F5", // Xám hơi đậm phía dưới
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
          style={{ marginVertical: 8, borderRadius: 8 }}
          bezier
          decorator={({ width, height }: { width: number; height: number }) => {
            const xSpacing = width / (labels.length + 1); // Khoảng cách giữa các điểm
            const yMax = Math.max(...values);
            const yMin = 0;
            const yScale = (height - 50) / (yMax - yMin || 1); // Tỷ lệ trục Y

            return (
              <Svg>
                {values.map((value, index) => {
                  const x = (index + 1) * xSpacing + 10; // Tọa độ X của điểm
                  const y = height - (value - yMin) * yScale - 15; // Căn chỉnh trục Y

                  return (
                    <SvgText
                      key={index}
                      x={x}
                      y={y}
                      fill="black"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      {value.toFixed(1)}
                    </SvgText>
                  );
                })}
              </Svg>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default HealthMetricsLineChart;

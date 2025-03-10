import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import Cell from "./Cell";

const Board: React.FC = () => {
  const [board, setBoard] = useState<Array<Array<string | null>>>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)) // Tạo mảng 9x9 với giá trị null
  );

  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  const handlePress = (row: number, col: number) => {
    if (board[row][col] !== null) return; // Nếu ô đã được đánh dấu, bỏ qua

    // Cập nhật giá trị ô
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Chuyển lượt người chơi
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  return (
    <View className="flex items-center">
      {board.map((row, rowIndex) => (
        <View className="flex flex-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              value={cell}
              onPress={() => handlePress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default Board;

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const CustomPieChart = ({ data }) => {
  const COLORS = ["#ff7675", "#b2bec3", "#00b894"]; 

  const percentageData = data.map((entry) => ({
    name: entry.name,
    value: parseFloat((entry.value * 100).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={percentageData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
          dataKey="value"
        >
          {percentageData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value}%`} />
        <Legend align="center" verticalAlign="bottom" height={10} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;

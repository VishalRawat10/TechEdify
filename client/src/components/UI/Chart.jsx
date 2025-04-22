import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const studyData = [
  { day: "Mon", time: 2 },
  { day: "Tue", time: 1 },
  { day: "Wed", time: 3 },
  { day: "Thu", time: 2.5 },
  { day: "Fri", time: 0.5 },
  { day: "Sat", time: 4 },
  { day: "Sun", time: 1.5 },
];

export default function StudyTimeChart() {
  return (
    <div className="w-full bg-white dark:bg-[var(--dark-bg-2)] rounded-xl p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Weekly Study Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={studyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis
            label={{ value: "Hours", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="time"
            stroke="#007bff"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

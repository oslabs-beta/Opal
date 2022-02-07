import React, { useState } from "react";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const colours = [
  "green",
  "red",
  "blue",
  "brown",
  "orange",
  "pink",
  "purple",
  "cyan",
];

interface GraphProps {
  data: any;
  format: string;
}

interface Data {
  Time: string;
  Total: number;
}

export const AreaLineChart = ({ data, format }: GraphProps) => {
  const randomColour = colours[Math.floor(Math.random() * colours.length)];
  const [time, setTime] = useState<object | null>(null);

  const createObj = () => {
    const arr: Array<object> = []!;

    for (let i in data.timeseries) {
      const obj: Data = { Time: "", Total: 0 };

      const mnt = moment(data.timeseries[i].timeStamp);

      obj["Time"] = mnt.format("LT");
      obj["Total"] = data.timeseries[i].total
        ? data.timeseries[i].total
        : data.timeseries[i].average ? data.timeseries[i].average : 0

      arr.push(obj);
    }

    setTime(arr);
  };

  if (!time) createObj();

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          // @ts-ignore
          data={time}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(14 165 233)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fff" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="Time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="blue"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

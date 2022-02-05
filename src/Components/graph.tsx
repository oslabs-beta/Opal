import React, { useState } from "react";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  time: string;
  total: number;
}

export const Graph = ({ data, format }: GraphProps) => {

  const randomColour = colours[Math.floor(Math.random() * colours.length)];
  const [time, setTime] = useState({});

  // console.log(data, format);

  const createObj = () => {
    const arr: Array<object> = []!;

    for (let i in data.timeseries) {
      const obj: Data = { time: "", total: 0 };

      const mnt = moment(data.timeseries[i].timeStamp);

      obj["time"] = mnt.format("LT");
      obj["total"] = data.timeseries[i].total
        ? data.timeseries[i].total
        : data.timeseries[i].average;

      arr.push(obj);
    }

    setTime(arr);
  };

  // IIFE
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
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="total"
            stroke="blue"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

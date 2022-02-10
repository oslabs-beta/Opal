import React, { useState } from "react";
import moment from "moment";
import {
  BarChart,
  Bar,
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
  error: any;
}

interface Data {
  Time: string;
  BytesReceived: number;
  BytesSent: number;
}

export const BandWidthBar = ({ data, format, error }: GraphProps) => {

  const [time, setTime] = useState<object | null>(null);

  const createObj = () => {
    const arr: Array<object> = []!;

    for (let i in data.timeseries) {
      const obj: Data = { Time: "", BytesReceived: 0, BytesSent: 0 };

      const mnt = moment(data.timeseries[i].timeStamp);

      obj["Time"] = mnt.format("LT");
      obj["BytesReceived"] = data.timeseries[i].total
        ? (data.timeseries[i].total).toFixed()
        : data.timeseries[i].average
        ? (data.timeseries[i].average).toFixed()
        : 0;

      obj["BytesSent"] = error.timeseries[i].total
        ? (error.timeseries[i].total).toFixed()
        : error.timeseries[i].average
        ? (error.timeseries[i].average).toFixed()
        : 0;

      arr.push(obj);
    }

    setTime(arr);
  };

  if (!time) createObj();

  return (
    <div className='relative -left-8' style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
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
          <Bar
            type="monotone"
            dataKey="BytesReceived"
            stroke="cyan"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Bar
            type="monotone"
            dataKey="BytesSent"
            stroke="green"
            fill="green"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

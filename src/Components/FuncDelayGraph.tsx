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
  Delay: number;
}

export const FuncDelayGraph = ({ data }: GraphProps) => {
  const [time, setTime] = useState<object | null>(null);
  console.log('inFuncDelayGraph');
  console.log('here is the current data in FuncDelayGraph');
  console.log(data);
  const createObj = () => {
    const arr: Array<object> = []!;

    for (let i in data) {
      const obj: Data = { Time: "", Delay: 0 };
      const mnt = moment(data[i].timeStamp);
      obj["Time"] = mnt.format("LT");
      obj["Delay"] = data[i].delay
        ? data[i].delay
        : 0
      arr.push(obj);
    }
    setTime(arr);
  };

  if (!time) createObj();

  return (
    <>
    <h1 className='flex items-center justify-center'>Function Response Time</h1>
    <div className='relative -left-8' style={{ width: "100%", height: 300 }}>
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
            dataKey="Delay"
            stroke="purple"
            fill="purple"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    </>
  );
};

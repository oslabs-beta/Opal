import React, { useState } from "react";
import moment from "moment";
import {
  LineChart,
  Line,
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
  Total: number;
  Errors: number;
}

export const FuncGraph = ({ data, format, error }: GraphProps) => {
  const randomColour = colours[Math.floor(Math.random() * colours.length)];
  const [time, setTime] = useState<object | null>(null);
  console.log('entering funcGraph')
  console.log('here is the data');
  console.log(data);
  const createObj = () => {
    console.log('running createObj');
    const arr: Array<object> = []!;
    console.log('about to enter loop')
    for (let i in data) {
      console.log('looping');
      const obj: Data = { Time: "", Total: 0, Errors: 0 };

      const mnt = moment(data[i].timeStamp);

      obj["Time"] = mnt.format("LT");
      obj["Total"] = data[i].total
        ? Math.floor(data[i].total)
        : data[i].average
        ? Math.floor(data[i].average)
        : 0;

      obj["Errors"] = error[i].total
        ? Math.floor(error[i].total)
        : error[i].average
        ? Math.floor(error[i].average)
        : 0;

      arr.push(obj);
    }
    setTime(arr);
  };

  if (!time) createObj();

  return (
    <div className='relative -left-8' style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
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
          <Line
            type="monotone"
            dataKey="Total"
            stroke="blue"
            fillOpacity={1}
            fill="url(#colorUv)"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Errors"
            stroke="red"
            fill="red"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

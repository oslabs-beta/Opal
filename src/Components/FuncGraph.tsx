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
}

interface Data {
  Time: string;
  Success: number;
  Fail: number;
}

export const FuncGraph = ({ data }: GraphProps) => {
  const [time, setTime] = useState<object | null>(null);
  console.log('entering funcGraph')
  console.log('here is the data');
  console.log(data);
  console.log('here is the current time ' + time)
  const createObj = () => {
    console.log('running createObj');
    //const arr: Array<object> = [];
    const arr: Array<object> = []!;
    console.log('arr');
    console.log(arr);
    console.log('about to enter loop')
    for (let i in data) {
      console.log('looping once');
      const obj: Data = { Time: "", Success: 0, Fail: 0};
      const mnt = moment(data[i].timeStamp);
      obj["Time"] = mnt.format("LT");
      console.log(obj["Time"]);
      obj["Success"] = data[i].successCount
        ? data[i].successCount : 0;

      obj["Fail"] = data[i].failCount ?
      data[i].failCount : 0;
      arr.push(obj);
    }
    setTime(arr);
  };

  if (!time) createObj();

  return (
    <>
    <h1>Successful Requests (200) v. Failed Requests)</h1>
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
            dataKey="Success"
            stroke="blue"
            fillOpacity={1}
            fill="url(#colorUv)"
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Fail"
            stroke="red"
            fill="red"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    </>
  );
};

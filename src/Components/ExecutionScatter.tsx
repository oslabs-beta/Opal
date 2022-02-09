import React, { useState } from 'react';
import moment from 'moment';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colours = ['green', 'red', 'blue', 'brown', 'orange', 'pink', 'purple', 'cyan'];

interface GraphProps {
  executionUnits: any;
  executionCount: any;
  format: string;
}

interface Data {
  Time: string;
  executionUnits: number;
  executionCount: number;
}

export const ExecutionScatter = ({ executionUnits, executionCount, format }: GraphProps) => {
  const [time, setTime] = useState<object | null>(null);

  const createObj = () => {
    const arr: Array<object> = []!;

    for (let i in executionUnits.timeseries) {
      const obj: Data = { Time: '', executionUnits: 0, executionCount: 0 };

      const mnt = moment(executionUnits.timeseries[i].timeStamp);

      obj['Time'] = mnt.format('LT');

      obj['executionUnits'] = executionUnits.timeseries[i].total
        ? (executionUnits.timeseries[i].total / 1024000) * 0.000016
        : executionUnits.timeseries[i].average
        ? (executionUnits.timeseries[i].average / 1024000) * 0.000016
        : 0;

      obj['executionCount'] = executionCount.timeseries[i].total
        ? executionCount.timeseries[i].total.toFixed()
        : executionCount.timeseries[i].average
        ? executionCount.timeseries[i].average.toFixed()
        : 0;

      arr.push(obj);
    }

    setTime(arr);
  };

  if (!time) createObj();

  return (
    <div className='relative -left-8' style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ScatterChart
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
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='rgb(14 165 233)' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#fff' stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray='3 3' />
          <XAxis dataKey='Time' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Scatter type='monotone' dataKey='executionUnits' stroke='purple' fill='purple' />
          <Scatter type='monotone' dataKey='executionCount' stroke='purple' fill='purple' />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

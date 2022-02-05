import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Graph } from '.';
// import { useAppDispatch } from '../redux/hooks';
import { changeTab } from '../redux/slices/dashSlice';
import { getExecOnlyData } from '../util/getExecOnlyData';
import { getMoreData } from '../util/getMoreData';

export const OverviewPage = () => {
  const dispatch = useDispatch();

  let session;

  if (sessionStorage.getItem('graphs'))
    session = JSON.parse(sessionStorage.getItem('graphs') || '');

  const [data, setData] = useState(session || []);
  const graphArr = [];

  useEffect(() => {
    if (!sessionStorage.getItem('graphs')) {
      const data:any = getExecOnlyData();
      console.log('getExecOnlyData',data);
      Promise.resolve(data)
        .then((result:object) => {
          console.log(result);
          if (result) {
            for (let i in result) {
              for (let x in result[i]) {
                for (let y in result[i][x]) {
                  // @ts-ignore
                  graphArr.push(result[i][x][y]);
                }
              }
            }
          }

          sessionStorage.setItem('graphs', JSON.stringify(graphArr));
          setData(graphArr);
        })
        .catch((err) => console.log(err));

    }
  }, []);

  return (<div>
      <div className='flex flex-wrap w-full justify-center items-center'>
          {console.log('specific data ')}
          {data && data.map((d) => {
                return (
                  <div
                    key={d.id}
                    className='flex flex-col items-center justify-center w-2/5 mb-52 p-4 border-2 border-gray-300 border-opacity-20 rounded-lg ml-4 mr-4 shadow-2xl'
                    onClick={() => {
                      Promise.resolve(getMoreData(d)).then((data) => {
                        dispatch(changeTab(`FunctionApp ${data.name}`));
                      });
                    }}
                  >
                    <h1 className='text-4xl font-bold mb-14'>{d.name}</h1>
                    <h3 className='text-2xl mb-12'>{d.metricName}</h3>
                    <Graph data={d} format={'1h'} />
                  </div>
                );
              })}
        </div>
  </div>)
}
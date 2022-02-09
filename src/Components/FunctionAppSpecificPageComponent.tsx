import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AreaLineChart, LineGraph, Loader, ExecutionScatter, DelayGraph, BandWidthBar, FuncListComponent } from '.';
import { getFuncAppData } from '../util/getFuncAppData';
import { getFuncAppFunctions } from '../util/getFuncAppFunctions';

interface SpecificFuncData {
  name: string;
  id: string;
  location: string;
  resourceGroupId: string;
  metrics: Array<object | any>;
}

interface LocationObj {
  state: any;
}

export const FunctionAppSpecificPage = () => {
  const location: LocationObj = useLocation();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<SpecificFuncData | null>(null);
  const [functions, setFunctions] = useState<[] | null>(null);

  const resourceGroupId = location.state.resourceGroupId.split('/');
  const resourceGroupName = resourceGroupId[resourceGroupId.length - 1];

  useEffect(() => {
    setLoading(true);
    Promise.resolve(getFuncAppData(location.state))
      .then((res: SpecificFuncData) => {
        // setLoading(false);
        setData(res);
      })
      .then((_) => {
        Promise.resolve(
          getFuncAppFunctions({
            subscriptionId: location.state.subscriptionId,
            resourceGroupName,
            appName: location.state.name,
          })
        ).then((res: any) => {
          setLoading(false);
          setFunctions(res.value);
        });
      });
  }, [location, resourceGroupName]);

  console.log(functions, data);

  return (
    <>
      {loading ? (
        <Loader theme='azure' />
      ) : data ? (
        <div className='w-full flex justify-center mb-16'>
          <div className='w-11/12'>
            <h1 className='text-2xl'>{data!.name}</h1>
            <br />
            <br />
            <div className='flex flex-col w-full h-auto justify-center items-center relative'>
              <h1>Total Invocations v. Errors</h1>
              <LineGraph data={data?.metrics[5]} format='1h' error={data?.metrics[3]} />
              <div className='flex w-full flex-col'>
                <div className='flex space-x-4 py-2'>
                  <h1 className='text-blue-500  w-16 whitespace-nowrap'>Total : </h1>
                  <p>{data?.metrics[5].description}</p>
                </div>
                <div className='flex space-x-6 py-2'>
                  <h1 className='text-[red]  w-16 whitespace-nowrap'>Errors :</h1>
                  <p>{data?.metrics[3].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className='flex flex-col w-full h-auto justify-center items-center relative'>
              <h1>Data Sent v. Received</h1>
              <BandWidthBar data={data?.metrics[0]} format='1h' error={data?.metrics[1]} />
              <div className='flex w-full flex-col'>
                <div className='flex space-x-4 py-2'>
                  <h1 className='text-blue-500  w-16 whitespace-nowrap'>Received : </h1>
                  <p>{data?.metrics[0].description}</p>
                </div>
                <div className='flex space-x-6 py-2'>
                  <h1 className='text-[red]  w-16 whitespace-nowrap'>Sent :</h1>
                  <p>{data?.metrics[1].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className='flex flex-col w-full h-auto justify-center items-center relative'>
              <h1>Total Time to Respond (in MS)</h1>
              <DelayGraph data={data?.metrics[6]} format='1h' />
              <div className='flex w-full flex-col'>
                <div className='flex space-x-4 py-2'>
                  <h1 className='text-blue-500  w-16 whitespace-nowrap'>Delay (ms) : </h1>
                  <p>{data?.metrics[6].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            {/*<div className='flex flex-col w-full h-auto justify-center items-center relative'>
              <h1>Cost Per Hour</h1>
              <ExecutionScatter executionUnits={data?.metrics[4]} executionCount={data?.metrics[5]} format='1h' />
              <div className='flex w-full flex-col'>
                <div className='flex space-x-4 py-2'>
                  <h1 className='text-blue-500  w-16 whitespace-nowrap'>Approx. Cost Per Hr,. : </h1>
                  <p>{data?.metrics[4].description}</p>
                </div>
              </div>
            </div>*/}
            <div className='flex h-auto w-full'>
              <div className='h-full p-5 border-t-2 border-[#363740] text-xl font-semibold'>
                <h1>Functions</h1>
              </div>
              <div className='h-full flex-grow border-l-2 border-t-2 border-[#363740] p-5'>
                {functions &&
                  functions.map((func: any) => {
                    return (
                      <FuncListComponent key={func.shortname} data={func} />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

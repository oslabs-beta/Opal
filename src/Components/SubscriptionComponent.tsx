import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaLineChart } from ".";

interface Props {
  name: string;
  resourceGrp: any;
}

export const Subscription = ({ resourceGrp, name }: Props) => {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>("all");

  const rGrp: Array<JSX.Element> = [];
  const graphs: Array<any> = [];

  for (let i in resourceGrp) {
    rGrp.push(
      <div
        className={`border-b-2 cursor-pointer p-5 hover:bg-sky-500 hover:text-white ${i === active && 'bg-sky-500 text-white'}`}
        onClick={() => setActive(i)}
        key={i}
      >
        {i}
      </div>
    );
  }

  if (active === "all") {
    for (let i in resourceGrp) {
      for (let x in resourceGrp[i]) {
        graphs.push(resourceGrp[i][x]);
      }
    }
  } else {
    for (let i in resourceGrp[`${active}`]) {
      graphs.push(resourceGrp[`${active}`][i]);
    }
  }

  return (
    <div className="w-full overflow-x-hidden -mt-10">
      <div className="bg-[#363740] flex justify-center space-x-4 h-20 items-center text-white text-xl p-3">
        <h1 className="font-semibold">Subscription:</h1>
        <h1>{name}</h1>
      </div>
      <div className="flex w-full space-x-8  overflow-x-scroll">
        <div className="flex items-center">{rGrp}</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-5">
        {active === "all" ? (
          <>
            <h1 className="text-center text-4xl mb-8">All Function Applications</h1>
            <div className='flex flex-wrap justify-center items-center'>
            {graphs &&
              graphs?.map((d) => {
                return (
                  <div
                    key={d.id}
                    className="flex flex-col items-center justify-center w-[600px] mb-52 p-4 border-2 border-gray-300 border-opacity-20 rounded-lg ml-4 mr-4 shadow-2xl cursor-pointer"
                    onClick={() =>
                      navigate(`/azure/functionApp/${d.name}`, { state: d })
                    }
                  >
                    <h1 className="text-4xl font-bold mb-14">{d.name}</h1>
                    <h3 className="text-2xl mb-12">{d.metricName}</h3>
                    <AreaLineChart data={d} format={"1h"} />
                  </div>
                );
              })}
              </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-4xl mb-8">Resource Group {active}</h1>
            {graphs &&
              graphs?.map((d) => {
                console.log(d);
                return (
                  <div
                    key={d.id}
                    className="flex flex-col items-center justify-center w-[600px] mb-52 p-4 border-2 border-gray-300 border-opacity-20 rounded-lg ml-4 mr-4 shadow-2xl cursor-pointer"
                    onClick={() =>
                      navigate(`/azure/functionApp/${d.name}`, { state: d })
                    }
                  >
                    <h1 className="text-4xl font-bold mb-14">{d.name}</h1>
                    <h3 className="text-2xl mb-12">{d.metricName}</h3>
                    <AreaLineChart data={d} format={"1h"} />
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};

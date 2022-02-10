import React from "react";
import { AreaLineChart } from ".";
import { useNavigate } from "react-router-dom";

interface Props {
    data: any
}

export const ResourceGroup = ({ data }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      key={data.id}
      className="flex flex-col items-center justify-center w-[600px] mb-32 p-4 border-2 border-opacity-20 rounded-lg ml-4 mr-4 shadow-2xl cursor-pointer"
      onClick={() => navigate(`/azure/functionApp/${data.name}`, { state: data })}
    >
      <h1 className="text-2xl font-bold mb-4">{data.name}</h1>
      <h3 className="text-xl mb-8">{data.metricName}</h3>
      <AreaLineChart data={data} format={"1h"} />
      <h3 className='mt-2'>Total Invocations : {data.totalCount}</h3>
    </div>
  );
};

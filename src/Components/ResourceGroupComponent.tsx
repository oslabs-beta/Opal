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
      className="flex flex-col items-center justify-center w-[600px] mb-52 p-4 border-2 border-gray-300 border-opacity-20 rounded-lg ml-4 mr-4 shadow-2xl cursor-pointer"
      onClick={() => navigate(`/azure/functionApp/${data.name}`, { state: data })}
    >
      <h1 className="text-4xl font-bold mb-14">{data.name}</h1>
      <h3 className="text-2xl mb-12">{data.metricName}</h3>
      <AreaLineChart data={data} format={"1h"} />
    </div>
  );
};

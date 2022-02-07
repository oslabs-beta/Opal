import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaLineChart, Loader } from ".";
import { getExecOnlyData } from "../util/getExecOnlyData";

export const OverviewPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  let session;

  if (sessionStorage.getItem("graphs"))
    session = JSON.parse(sessionStorage.getItem("graphs") || "");

  const [data, setData] = useState(session || []);
  const graphArr = [];

  useEffect(() => {
    if (!sessionStorage.getItem("graphs")) {
      setLoading(true);
      const data: any = getExecOnlyData();
      // console.log("getExecOnlyData", data);
      Promise.resolve(data)
        .then((result: object) => {
          setLoading(false);
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

          sessionStorage.setItem("graphs", JSON.stringify(graphArr));
          setData(graphArr);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader theme={'azure'} />
      ) : (
        <div>
          <div className="flex flex-wrap w-full justify-center items-center p-5">
            {data &&
              data.map((d) => {
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
        </div>
      )}
    </>
  );
};

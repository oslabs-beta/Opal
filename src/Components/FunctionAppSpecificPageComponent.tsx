import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LineGraph,
  Loader,
  DelayGraph,
  BandWidthBar,
  FuncListComponent,
} from ".";
import { getFuncAppData } from "../util/getFuncAppData";
import { getFuncAppFunctions } from "../util/getFuncAppFunctions";
import { Slider, Button } from "@mui/material";
// import { lodash } from "lodash";

import { costEstimator } from "../util/costEstimator";

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
  const [timeSpan, setTimeSpan] = useState<number>(1);
  const [granularity, setGranularity] = useState<number>(3);
  let [submitClick, setSubmitClick] = useState<boolean>(false);

  const resourceGroupId = location.state.resourceGroupId.split("/");
  const resourceGroupName = resourceGroupId[resourceGroupId.length - 1];

  const timeFrameMarks = [
    { value: 0, label: "1 Hour" },
    { value: 1, label: "24 Hours" },
    { value: 2, label: "48 Hours" },
    { value: 3, label: "1 Week" },
    { value: 4, label: "1 Month" },
  ];
  const granularityMarks = [
    { value: 0, label: "5 Minutes" },
    { value: 1, label: "15 Minutes" },
    { value: 2, label: "30 Minutes" },
    { value: 3, label: "1 Hour" },
    { value: 4, label: "6 Hours" },
    { value: 5, label: "12 Hours" },
    { value: 6, label: "1 Day" },
  ];

  useEffect(() => {
    setLoading(true);
    Promise.resolve(getFuncAppData(location.state, timeSpan, granularity))
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
  }, [location, resourceGroupName, submitClick]);

  function convertTimeSpan(num) {
    for (let timeFrame of timeFrameMarks) {
      if (timeFrame.value === num) return timeFrame.label;
    }
    return null;
  }

  function convertGranularity(num) {
    for (let gran of granularityMarks) {
      if (gran.value === num) return gran.label;
    }
    return null;
  }

  function handleTimeSpan(event, value) {
    setTimeSpan(value);
  }

  function handleGranularity(event, value) {
    setGranularity(value);
  }

  function handleSend() {
    submitClick === false ? setSubmitClick(true) : setSubmitClick(false);
  }

  return (
    <>
      {loading ? (
        <Loader theme="azure" />
      ) : data ? (
        <div className="w-full flex justify-center mb-16">
          <div className="w-11/12">
            <div className="w-full flex flex-col justify-center items-center">
              <div className="text-center">
                Estimated Cost of {data!.name} for Selected Period: <br />
                {costEstimator(
                  data?.metrics,
                  convertGranularity(granularity),
                  convertTimeSpan(timeSpan)
                )}
              </div>
              <br />
              <br />
              <h1>Select Timespan</h1>
              <Slider
                key={1}
                className="w-full"
                sx={{ width: 2 / 3 }}
                aria-label="TimeSpan"
                value={timeSpan}
                valueLabelDisplay="auto"
                step={null}
                marks={timeFrameMarks}
                max={4}
                onChangeCommitted={handleTimeSpan}
              ></Slider>
              <h1>Select Granularity</h1>
              <Slider
                key={2}
                className="w-full"
                sx={{ width: 2 / 3 }}
                aria-label="Granularity"
                value={granularity}
                valueLabelDisplay="auto"
                step={null}
                marks={granularityMarks}
                max={6}
                onChangeCommitted={handleGranularity}
              ></Slider>
              <br />
              <Button onClick={handleSend}>Update Preferences</Button>
            </div>
            <br />
            <br />
            <br />
            <br />
            <div className="flex flex-col w-full h-auto justify-center items-center relative">
              <h1>Total Invocations v. Errors</h1>
              <LineGraph
                data={data?.metrics[5]}
                format="1h"
                error={data?.metrics[3]}
              />
              <div className="flex w-full flex-col">
                <div className="flex space-x-4 py-2">
                  <h1 className="text-blue-500  w-16 whitespace-nowrap">
                    Total :{" "}
                  </h1>
                  <p>{data?.metrics[5].description}</p>
                </div>
                <div className="flex space-x-6 py-2">
                  <h1 className="text-[red]  w-16 whitespace-nowrap">
                    Errors :
                  </h1>
                  <p>{data?.metrics[3].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="flex flex-col w-full h-auto justify-center items-center relative">
              <h1>Data Sent v. Received</h1>
              <BandWidthBar
                data={data?.metrics[0]}
                format="1h"
                error={data?.metrics[1]}
              />
              <div className="flex w-full flex-col">
                <div className="flex space-x-4 py-2">
                  <h1 className="text-blue-500  w-16 whitespace-nowrap">
                    Received :{" "}
                  </h1>
                  <p>{data?.metrics[0].description}</p>
                </div>
                <div className="flex space-x-6 py-2">
                  <h1 className="text-[red]  w-16 whitespace-nowrap">Sent :</h1>
                  <p>{data?.metrics[1].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="flex flex-col w-full h-auto justify-center items-center relative">
              <h1>Total Time to Respond (in MS)</h1>
              <DelayGraph data={data?.metrics[6]} format="1h" />
              <div className="flex w-full flex-col">
                <div className="flex space-x-4 py-2">
                  <h1 className="text-blue-500  w-16 whitespace-nowrap">
                    Delay (ms) :{" "}
                  </h1>
                  <p>{data?.metrics[6].description}</p>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="flex h-auto w-full">
              <div className="h-full p-5 border-t-2 border-[#363740] text-xl font-semibold">
                <h1>Functions</h1>
              </div>
              <div className="h-full flex-grow border-l-2 border-t-2 border-[#363740] p-5">
                {functions &&
                  functions.map((func: any, idx: number) => {
                    return <FuncListComponent key={idx} data={func} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

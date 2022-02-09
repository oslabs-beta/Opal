import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from ".";
import { getFuncDetails } from "../util/getFuncDetails";
import { FuncGraph } from "./FuncGraph";

interface LocationObj {
  state: any;
}

interface SeriesObj {
  timeseries: any;
}

export const FunctionSpecificPage = () => {
  const location: LocationObj = useLocation();
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<null | object>(null);
  const [failData, setFailData] = useState<null | object>(null);
  const successArray : string[] = [];
  const failArray : string[] = [];


  const workSpaceId = sessionStorage.getItem("workSpaceId");
  console.log(location, workSpaceId);
  useEffect(() => {
    const details: any = getFuncDetails({
      workSpaceId,
      functionName: location.state.properties.name,
    });
    console.log(details);
    Promise.resolve(details).then((res) => {
      setLoading(false);
      console.log('response.data');
      console.log(res.data);
      //TimeGenerated --> timeStamp
      //DurationMS --> total
      // Could move this to backend.
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].timeStamp = res.data[i].TimeGenerated;
        res.data[i].total = res.data[i].DurationMs;
        if (res.data[i].ResultCode === "200") {
          successArray.push(res.data[i]);
        } else {
          failArray.push(res.data[i]);
        }
      }
      setFailData(failArray);
      setSuccessData(successArray);
      console.log(successData);
      console.log(failData)
    });
  }, []);
  return (
    <>
      { loading ?
        <Loader theme='azure' />
        :
        <div>
          <h1> Oh so you want to view a specific function </h1>
          <FuncGraph data={successData} format='1h' error={failData} />
        </div>
      }
    </>
  );
};

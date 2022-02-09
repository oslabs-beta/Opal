import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader, FuncGraph } from ".";
import { getFuncDetails } from "../util/getFuncDetails";

interface LocationObj {
  state: any;
}

interface SeriesObj {
  timeseries: any;
}

export const FunctionSpecificPage = () => {
  const location: LocationObj = useLocation();
  const [loading, setLoading] = useState(true);

  const [funcData, setFuncData] = useState<null | object>(null);

  const data:[] = [];

  const workSpaceId = sessionStorage.getItem("workSpaceId");

  useEffect(() => {
    const details: any = getFuncDetails({
      workSpaceId,
      functionName: location.state.properties.name,
    });
    Promise.resolve(details).then((res) => {
      setFuncData(res.data);
      setLoading(false);
    });
  }, [location.state.properties.name, workSpaceId]);

  return (
    <>
      { loading ?
        <Loader theme='azure' />
        :
        <div>
          <FuncGraph data={funcData} format='1h'/>
        </div>
      }
    </>
  );
};

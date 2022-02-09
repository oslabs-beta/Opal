import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from ".";
import { getFuncDetails } from "../util/getFuncDetails";

interface LocationObj {
  state: any;
}

export const FunctionSpecificPage = () => {
  const location: LocationObj = useLocation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<null | object>(null);

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
      console.log('response');
      console.log(res);
    });
  });
  return (
    <>
      { loading ?
        <Loader theme='azure' />
        :
        <div>
          <h1> Oh so you want to view a specific function </h1>
        </div>
      }
    </>
  );
};

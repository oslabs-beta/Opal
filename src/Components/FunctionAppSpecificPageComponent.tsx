import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader } from ".";
import { getMoreData } from "../util/getMoreData";

export const FunctionAppSpecificPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    Promise.resolve(getMoreData(location.state)).then((res) => {
      setLoading(false);
      console.log(res);
    });
  }, [location]);

  return (
    <>
      {loading ? (
        <Loader theme='azure' />
      ) : (
        <div>
          <h1>Oh so you think you can view a specific function app yeh?</h1>
        </div>
      )}
    </>
  );
};

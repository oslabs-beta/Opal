import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaLineChart, Loader, Subscription } from ".";
import { getAllFunctions } from "../util/getAllFuncs";
import { getExecOnlyData } from "../util/getExecOnlyData";

export const OverviewPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("executionObj")) {
      const graphs: any = [];
      setLoading(true);
      const data: any = getExecOnlyData();

      Promise.resolve(data)
        .then((result: object) => {
          sessionStorage.setItem("executionObj", JSON.stringify(result));
          setLoading(false);
          if (result) {
            for (let i in result) {
              for (let x in result[i]) {
                for (let y in result[i][x]) {
                  if (!sessionStorage.getItem("workSpaceId")) {
                    sessionStorage.setItem(
                      "workSpaceId",
                      result[i][x][y].workSpaceId || ""
                    );
                  }
                  graphs.push(result[i][x][y]);
                }
              }
            }
          }

          sessionStorage.setItem("graphs", JSON.stringify(graphs));

          if (sessionStorage.getItem("executionObj")) {
            //@ts-ignore
            const executionObj = JSON.parse(
              sessionStorage.getItem("executionObj") || "{}"
            );
            const functions: any = getAllFunctions({ executionObj });
            Promise.resolve(functions).then((result: any) => {
              // setLoading(false);
              sessionStorage.setItem("functions", JSON.stringify(result));
            });
          }
        })
        .catch((err) => console.log(err));
    }

    return () => {};
  }, []);

  let subscriptions: any = [];
  if (sessionStorage.getItem("executionObj")) {
    const obj = JSON.parse(sessionStorage.getItem("executionObj") || "{}");
    for (let i in obj) {
      subscriptions.push(
        <Subscription key={i} name={i} resourceGrp={obj[i]} />
      );
    }
  }

  return (
    <>
      {loading ? (
        <Loader theme={"azure"} />
      ) : (
        <div>
          <div className="flex flex-wrap w-full justify-center items-center p-5">
            {subscriptions}
          </div>
        </div>
      )}
    </>
  );
};

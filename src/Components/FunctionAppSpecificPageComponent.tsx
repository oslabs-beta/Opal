import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AreaLineChart, LineGraph, Loader } from ".";
import { getFuncAppData } from "../util/getFuncAppData";
import { getFuncAppFunctions } from "../util/getFuncAppFunctions";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";
import { motion } from "framer-motion";

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

  const resourceGroupId = location.state.resourceGroupId.split("/");
  const resourceGroupName = resourceGroupId[resourceGroupId.length - 1];

  useEffect(() => {
    setLoading(true);
    Promise.resolve(getFuncAppData(location.state))
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
  }, [location, resourceGroupName]);

  console.log(functions, data);

  return (
    <>
      {loading ? (
        <Loader theme="azure" />
      ) : data ? (
        <div className="w-full flex justify-center mb-16">
          <div className="w-11/12">
            <h1 className="text-2xl">{data!.name}</h1>
            <br />
            <br />
            <div className="flex flex-col w-full h-auto justify-center items-center relative">
              <LineGraph
                data={data?.metrics[5]}
                format="1h"
                error={data?.metrics[3]}
              />
              <br />
              <br />
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
            <h1>// List of individual errors and at what time they occured</h1>
            <br />
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis
              veniam iusto asperiores quibusdam laboriosam nesciunt et ex
              consequatur voluptatem delectus a maiores cupiditate maxime
              dignissimos, amet repellendus natus. Commodi, non?
            </p>
            <br />
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              nobis necessitatibus, harum officia aspernatur cumque numquam odit
              sint tempore ut aperiam nesciunt corrupti, repudiandae fugit
              provident iure amet ad explicabo?
            </p>
            <br />
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              nobis necessitatibus, harum officia aspernatur cumque numquam odit
              sint tempore ut aperiam nesciunt corrupti, repudiandae fugit
              provident iure amet ad explicabo?
            </p>
            <br />
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              nobis necessitatibus, harum officia aspernatur cumque numquam odit
              sint tempore ut aperiam nesciunt corrupti, repudiandae fugit
              provident iure amet ad explicabo?
            </p>
            <br />
            <br />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              nobis necessitatibus, harum officia aspernatur cumque numquam odit
              sint tempore ut aperiam nesciunt corrupti, repudiandae fugit
              provident iure amet ad explicabo?
            </p>
            <br />
            <br />
            <div className="flex h-auto w-full">
              <div className="h-full p-5 border-t-2 border-[#363740] text-xl font-semibold">
                <h1>Functions</h1>
              </div>
              <div className="h-full flex-grow border-l-2 border-t-2 border-[#363740] p-5">
                {functions &&
                  functions.map((func: any) => {
                    return (
                      <motion.div
                        whileHover={{ scale: 1.025 }}
                        key={func.name}
                        className="p-6 mb-4 shadow-md border-2 rounded-lg flex justify-between cursor-pointer hover:bg-[#e5e7eb] hover:shadow-xl"
                      >
                        <h1>{func.properties.name}</h1>
                        <div>
                          {func.properties.isDisabled ? (
                            <div className="flex space-x-4 items-center">
                              <h1 className="font-medium">Disabled</h1>
                              <XCircleIcon className="w-6 h-6 text-red-500" />
                            </div>
                          ) : (
                            <div className="flex space-x-10 items-center justify-between ">
                              <h1>{func.properties.language}</h1>
                              <div className="flex space-x-4 items-center ">
                                <h1 className="font-medium">Active</h1>
                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
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

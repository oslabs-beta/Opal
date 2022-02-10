import React, { useEffect, useState } from "react";
import { FuncAppListComponent } from ".";
import { SearchIcon } from "@heroicons/react/solid";

export const FunctionAppPage = () => {
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("graphs") || "{}")
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {});

  return (
    <div className="w-full h-auto flex justify-center">
      <div className="w-11/12 flex flex-col">
        <div className="flex justify-center items-center w-full rounded-lg mb-10 ">
          <div className="w-full xl:w-2/3 2xl:w-2/3 border-2   shadow-lg rounded-lg px-4 py-2 flex items-center relative overflow-hidden">
            <input
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 focus:outline-none"
              type="text"
            />
            <div className="absolute -right-2 top-0 h-full w-16 bg-sky-500 rounded-r-lg cursor-pointer flex justify-center items-center">
              <SearchIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="w-full">
          {data?.length > 0 && searchQuery.length === 0
            ? data.map((val: any) => {
                return <FuncAppListComponent key={val.name} data={val} />;
              })
            : data?.map((val: any) => {
                if (
                  val.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                  return <FuncAppListComponent key={val.name} data={val} />;
                } else {
                  return null;
                }
              })}
        </div>
      </div>
    </div>
  );
};

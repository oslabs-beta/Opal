import { SearchIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { FuncListComponent } from ".";

export const FunctionsPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('functions') || '{"functions": "[]"}'));

  const [searchQuery, setSearchQuery] = useState("");

  return (

    <div className="flex justify-center w-full h-auto">
      <div className="w-11/12">
        {data.functions.length > 0 ? <div className="flex justify-center items-center w-full rounded-lg mb-10 ">
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
        </div> : null }
        <div className="w-full">
          {data.functions.length > 0 ?
            data.functions.map((func) => {
              if (func.shortname.toLowerCase().includes(searchQuery.toLowerCase())) {
                return <FuncListComponent key={func.shortname} data={func} />;
              } else {
                return null;
              }
            }) : (
              <div>
                <h1><strong>Error: Cannot retrieve function list. Environmental variables for service principal are not set.</strong></h1>
                <br />
                <h2>Please review the Opal README for more information.</h2>
                <br />
                <button className='flex justify-center w-full h-auto' onClick={() => window.location.replace('/azure/overview')}>Click to Refresh</button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

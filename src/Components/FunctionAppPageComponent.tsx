import React, { useEffect, useState } from "react";
import { FuncAppListComponent } from ".";

export const FunctionAppPage = () => {
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("graphs") || "{}")
  );
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(data);
  useEffect(() => {
    
  })

  return (
    <div className="w-full h-auto flex justify-center">
      <div className="w-11/12">
        {data?.length > 0 && searchQuery.length === 0
          ? data.map((val: any) => {
              return <FuncAppListComponent key={val.name} data={val} />;
            })
          : filtered?.map((val: any) => {
              return <FuncAppListComponent key={val.name} data={val} />;
            })}
      </div>
    </div>
  );
};

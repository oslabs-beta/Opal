import React, { useState } from 'react';
import { FuncListComponent } from '.';

export const FunctionsPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('functions') || "{}"));

  console.log(data);
  return (
      <div className='flex justify-center w-full h-auto'>
          <div className='w-11/12'>
            {data.functions.length > 0 && data.functions.map((func) => {
              return (
                <FuncListComponent key={func.shortname} data={func} />
              )
            })}
          </div>
      </div>
  );
}

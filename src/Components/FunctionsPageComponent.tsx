import React, { useState } from 'react';
import { FuncListComponent } from '.';

export const FunctionsPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('functions') || '{"functions": "[]"}'));

  console.log(data);
  return (
    <div className='flex justify-center w-full h-auto'>
      <div className='w-11/12'>
        {data.functions.length > 0 ? (
          data.functions.map((func) => {
            return <FuncListComponent key={func.shortname} data={func} />;
          })
        ) : (
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
  );
};

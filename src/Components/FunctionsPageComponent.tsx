import React, { useState } from 'react';

export const FunctionsPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('functions') || ''));

  console.log(data);
  
  return (
      <div>
          <h1>List of all functions in a function app</h1>
      </div>
  );
}

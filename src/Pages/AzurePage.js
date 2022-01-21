import React from 'react';

function AzurePage() {
  return (
    <div className='h-screen w-full bg-[#363740] flex'>
      <div className='open relative left-0 transition-all hover:transition-all ease-in-out h-screen bg-white'>
        <p className='text-white'>Sidebar</p>
      </div>
      <div className='flex-grow w-full'>
        <p className='text-white'>Main Dashboard</p>
      </div>
    </div>
  );
}

export default AzurePage;

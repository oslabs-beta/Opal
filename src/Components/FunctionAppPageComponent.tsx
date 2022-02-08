import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const FunctionAppPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('graphs') || "{}"));
  const navigate = useNavigate();

  return (
    <div className="w-full h-auto flex justify-center">
      <div className="w-11/12">
        {data?.length > 0 && data.map((val:any) => {
          return (
            <motion.div whileHover={{scale: 1.025}} key={val.name} className='p-6 mb-4 shadow-lg cursor-pointer border-2 rounded-lg flex justify-between hover:bg-[#e5e7eb] hover:shadow-xl' onClick={() =>
              navigate(`/azure/functionApp/${val.name}`, { state: val })
            }>
              <h1>{val.name}</h1>
              <div>
                <h1>{val.subscriptionDisplayName}</h1>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  );
};

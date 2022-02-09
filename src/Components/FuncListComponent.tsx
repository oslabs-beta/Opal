import React from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';

export const FuncListComponent = ({ data }) => {
    const navigate = useNavigate()
  return (
    <motion.div
    whileHover={{ scale: 1.025 }}
    key={data.name}
    className='p-6 mb-4 shadow-md border-2 rounded-lg flex justify-between cursor-pointer hover:bg-[#e5e7eb] hover:shadow-xl'
    onClick={() => navigate(`/azure/functions/${data.properties.name}`, { state: data })}
  >
    <h1>{data.properties.name}</h1>
    <div>
      {data.properties.isDisabled ? (
        <div className='flex space-x-4 items-center'>
          <h1 className='font-medium'>Disabled</h1>
          <XCircleIcon className='w-6 h-6 text-red-500' />
        </div>
      ) : (
        <div className='flex space-x-10 items-center justify-between '>
          <h1>{data.properties.language}</h1>
          <div className='flex space-x-4 items-center '>
            <h1 className='font-medium'>Active</h1>
            <CheckCircleIcon className='w-6 h-6 text-green-500' />
          </div>
        </div>
      )}
    </div>
  </motion.div>
  );
}
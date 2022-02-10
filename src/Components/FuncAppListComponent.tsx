import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FunctionApp } from '../../Types';

interface Props {
  data: FunctionApp
}

export const FuncAppListComponent = ({ data }: Props) => {
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{scale: 1.025}} key={data.name} className='p-6 mb-4 shadow-lg cursor-pointer border-2 rounded-lg flex justify-between hover:bg-[#e5e7eb] hover:shadow-xl' onClick={() =>
      navigate(`/azure/functionApp/${data.name}`, { state: data })
    }>
      <h1>{data.name}</h1>
      <div className='flex space-x-4'>
        <h1>{data.resourceGroupName}</h1>
        <h1>{data.subscriptionDisplayName}</h1>
      </div>
    </motion.div>
  );
}

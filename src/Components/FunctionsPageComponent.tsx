import React, { useState } from 'react';
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export const FunctionsPage = () => {
  const [data, setData] = useState(JSON.parse(sessionStorage.getItem('functions') || "{}"));

  console.log(data);
  return (
      <div className='flex justify-center w-full h-auto'>
          <div className='w-11/12'>
            {data.functions.length > 0 && data.functions.map((func) => {
              return (
                <motion.div whileHover={{ scale: 1.025}} key={func.shortname} className='p-6 mb-4 shadow-md border-2 rounded-lg flex justify-between cursor-pointer hover:bg-[#e5e7eb] hover:shadow-xl' onClick={() => {}}>
                  <h1>{func.shortname}</h1>
                  <div>
                          {func.properties.isDisabled ? (
                            <div className="flex space-x-4 items-center">
                              <h1 className="font-medium">Disabled</h1>
                              <XCircleIcon className="w-6 h-6 text-red-500" />
                            </div>
                          ) : (
                            <div className="flex space-x-10 items-center justify-between ">
                              <h1>{func.properties.language}</h1>
                              <div className="flex space-x-4 items-center ">
                                <h1 className="font-medium">Active</h1>
                                <CheckCircleIcon className="w-6 h-6 text-green-500" />
                              </div>
                            </div>
                          )}
                        </div>
                </motion.div>
              )
            })}
          </div>
      </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getExecOnlyData } from '../util/getExecOnlyData';

import { ChartBarIcon } from '@heroicons/react/outline';
import { CubeTransparentIcon } from '@heroicons/react/outline';
import { LogoutIcon } from '@heroicons/react/outline';
import { UserIcon } from '@heroicons/react/outline';
import { ClipboardIcon } from '@heroicons/react/outline';
import { CloudIcon } from '@heroicons/react/outline';
import { BookOpenIcon } from '@heroicons/react/outline';

// Components
import Overview from '../Components/Overview';
import { useDispatch, useSelector } from 'react-redux';
import { changeTab } from '../redux/slices/dashSlice';
import { Graph } from '../Components/';

function AzurePage() {
  const dispatch = useDispatch();

  const [sidebarActive, setSidebarActive] = useState(null);

  const Tab = useSelector((state) => state.dash.tab);
  const user = useSelector((state) => state.user.user);

  let session;

  if (sessionStorage.getItem('graphs') && !sidebarActive)
    session = JSON.parse(sessionStorage.getItem('graphs'));

  const [data, setData] = useState(session || []);
  const graphArr = [];

  useEffect(() => {
    if (!sessionStorage.getItem('graphs')) {
      const data = getExecOnlyData();
      Promise.resolve(data)
        .then((result) => {
          if (result) {
            for (let i in result) {
              for (let x in result[i]) {
                for (let y in result[i][x]) {
                  graphArr.push(result[i][x][y]);
                }
              }
            }
          }

          sessionStorage.setItem('graphs', JSON.stringify(graphArr));
        })
        .catch((err) => console.log(err));

      setData(graphArr);
    }
  }, []);

  // IIFE
  // (function parse() {
  //   console.log('hi');
  // })();

  console.log('this is data', data);

  return (
    <div className='h-screen w-full flex'>
      <div
        className='open relative left-0 transition-all hover:transition-all ease-in-out h-screen bg-[#363740] flex  scrollbar-hide flex-col items-center overflow-x-hidden'
        onMouseLeave={() => setSidebarActive(false)}
        onMouseEnter={() => setSidebarActive(true)}
      >
        <br />
        <div className='flex flex-col items-center'>
          <div className='flex items-center justify-center bg-sky-500 p-2 rounded-full'>
            <motion.img
              className='rotate w-12 h-12'
              src='../../assets/images/Opal Logo No Background.png'
              alt='Opal Logo Red Background'
            />
          </div>
          {sidebarActive ? (
            <p className='text-2xl mt-3 text-gray-400'>Opal</p>
          ) : (
            <p className='text-2xl mt-3 text-[#363740]'>Opal</p>
          )}
        </div>
        <br />
        {sidebarActive ? (
          <p className='text-white text-2xl whitespace-nowrap'>
            Azure Dashboard
          </p>
        ) : (
          <p className='text-[#363740] whitespace-nowrap text-2xl'>A</p>
        )}
        <br />
        <div className='w-full'>
          <div
            onClick={() => dispatch(changeTab('Overview'))}
            className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            } `}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Overview'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <ChartBarIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? (
                <h1 className='hidden md:inline-block'>Overview</h1>
              ) : (
                ''
              )}
            </div>
          </div>

          <div
            onClick={() => dispatch(changeTab('Functions'))}
            className={` focus:text-blue-500 whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            }`}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Functions'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <CubeTransparentIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? <h1>Functions</h1> : ''}
            </div>
          </div>

          <div
            onClick={() => dispatch(changeTab('Func Details'))}
            className={`focus:text-blue-500 whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            }`}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Func Details'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <CloudIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? <h1>Func Details</h1> : ''}
            </div>
          </div>

          <div
            onClick={() => dispatch(changeTab('Summary'))}
            className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            }`}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Summary'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <BookOpenIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? <h1>Summary</h1> : ''}
            </div>
          </div>

          <div
            onClick={() => dispatch(changeTab('Azure Details'))}
            className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            }`}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Azure Details'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <ClipboardIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? <h1>Azure Details</h1> : ''}
            </div>
          </div>

          <div
            onClick={() => dispatch(changeTab('Account'))}
            className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
              sidebarActive ? '' : 'justify-center'
            }`}
          >
            <div
              className={`flex items-center ${
                !sidebarActive && Tab === 'Account'
                  ? 'bg-gray-500 bg-opacity-40 p-2 rounded-md'
                  : ''
              }`}
            >
              <UserIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? 'mr-6' : ''
                }`}
              />
              {sidebarActive ? <h1>Account</h1> : ''}
            </div>
          </div>
        </div>
        <br />
        <div
          onClick={() => window.location.replace('/')}
          className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 lg:absolute bottom-0 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? '' : 'justify-center'
          }`}
        >
          <LogoutIcon
            className={`text-white w-10 h-10 ${sidebarActive ? 'mr-6' : ''}`}
          />
          {sidebarActive ? <h1>Logout</h1> : ''}
        </div>
      </div>
      <div className='flex-grow overflow-y-scroll scrollbar-hide w-full bg-white relative'>
        <div className='sticky top-0 z-10 w-full bg-white h-28 drop-shadow-lg flex items-center justify-center'>
          <div className='w-11/12 h-4/6 flex justify-between items-center'>
            <div className='text-3xl font-medium'>{Tab}</div>
            <div className='flex items-center'>
              <h1 className=' font-medium text-lg'>
                {user.firstname[0].toUpperCase() + user.firstname.slice(1)}{' '}
                {user.lastname[0].toUpperCase() + user.lastname.slice(1)}
              </h1>
              <div className='ml-4'>
                <img
                  className='w-12 h-11 rounded-full'
                  src='../../assets/images/pfp.png'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-40 w-full flex justify-center'>
          <img src='../../assets/images/graphTrend.png' alt='' />
        </div>
        <div className='mt-32 flex justify-center'>
          <img src='../../assets/images/graph.png' alt='' />
        </div>

        <div className='flex flex-wrap w-full justify-center items-center'>
          {data.map((d) => {
            return (
              <div
                key={d.id}
                className='flex flex-col items-center justify-center w-2/5 mb-52 p-4 border-2 border-gray-500 border-opacity-20 rounded-lg ml-4 mr-4'
              >
                <h1 className='text-4xl font-bold mb-14'>{d.name}</h1>
                <Graph data={d} format={'1h'} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AzurePage;

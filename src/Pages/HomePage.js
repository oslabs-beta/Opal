import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './animation.css';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className='min-h-full h-screen w-full bg-[#363740] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='fixed top-0 w-full h-28 drop-shadow-lg flex items-center justify-center p-4'>
        <div className='w-full flex justify-between px-5 py-5 items-center'>
          <div className='flex justify-center items-start'>
            <div className='flex justify-center bg-rose-500 p-1.5 rounded-full'>
              <img
                className='rotate w-24 h-24'
                src='../../assets/images/Opal Logo No Background.png'
                alt='Opal Logo Red Background'
              />
            </div>
            <p className='text-8xl font-semibold text-white'>Opal</p>
          </div>

          <div className='flex items-center'>
            <motion.button
              type='button'
              whileTap={{ scale: 0.9 }}
              animate={{ y: 10 }}
              onClick={() => navigate('/login')}
              className='bg-transparent border-2 border-rose-500 w-full p-4 rounded-lg text-white focus:outline-white mr-5 hover:bg-rose-500 hover:text-white '
            >
              Log In
            </motion.button>

            <motion.button
              type='button'
              whileTap={{ scale: 0.9 }}
              animate={{ y: 10 }}
              onClick={() => navigate('/signup')}
              className='bg-transparent border-2 border-rose-500 w-full p-4 rounded-lg text-white focus:outline-white hover:bg-rose-500 hover:text-white '
            >
              Signup
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

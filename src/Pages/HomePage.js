import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './animation.css';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className='min-h-full h-screen w-full bg-[#363740] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-center items-start'>
        <div className='flex justify-center bg-rose-500 p-1.5 rounded-full'>
          <img
            className='rotate w-24 h-24'
            src='../../assets/images/Opal Logo No Background.png'
            alt='Opal Logo Red Background'
          />
        </div>
        <p className='text-8xl font-semibold font-sans '>OPAL</p>
      </div>
      <div className='flex items-center justify-center'>
        <motion.button
          type='button'
          whileTap={{ scale: 0.9 }}
          animate={{ y: 10 }}
          onClick={() => navigate('/login')}
          className='bg-rose-500 mt-4 mb-4 w-full p-4 rounded-lg text-white focus:outline-white'
        >
          Log In
        </motion.button>
        <motion.button
          type='button'
          whileTap={{ scale: 0.9 }}
          animate={{ y: 10 }}
          onClick={() => navigate('/signup')}
          className='bg-rose-500 mt-4 mb-4 w-full p-4 rounded-lg text-white focus:outline-white'
        >
          Signup
        </motion.button>
      </div>
    </div>
  );
}

export default HomePage;

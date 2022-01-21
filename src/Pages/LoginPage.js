import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon } from '@heroicons/react/solid';
import './animation.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
  }

  const Password = useRef(null);
  const Username = useRef(null);

  return (
    <div className='min-h-full h-screen w-full bg-[#363740] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <form className='w-1/4 h-fit rounded bg-white flex flex-col justify-center py-12 px-9'>
        <div className='flex flex-col justify-center'>
          <div className='flex items-center justify-center flex-col'>
            <div className='flex justify-center bg-rose-500 p-1.5 rounded-full'>
              <motion.img
                className='rotate w-14 h-14'
                src='../../assets/images/Opal Logo No Background.png'
                alt='Opal Logo Red Background'
              />
            </div>
            <p className='text-2xl mt-3 text-gray-400'>Opal</p>
          </div>
          <p className='text-center text-gray-400 mt-1.5'>
            Enter your email and password below
          </p>
          <br />
          <label className='text-sm mb-1.5 text-gray-400'>
            EMAIL OR USERNAME
          </label>
          <input
            ref={Username}
            className='border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3'
            type='text'
            placeholder='Email address or Username'
          />

          <label className='text-sm mb-1.5 text-gray-400'>PASSWORD</label>
          <input
            ref={Password}
            className='border-2 mb-4 px-4 py-3 font-light rounded-lg focus:outline-none focus:border-rose-500 focus:border-3 '
            type='password'
            placeholder='Password'
          />
          <motion.button
            type='button'
            onClick={() => {
              Password.current.value.length > 6 && Username.current.value
                ? alert('success')
                : alert('what the *****');
            }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: 10 }}
            className='bg-rose-500 mt-4 mb-4 w-full p-4 rounded-lg text-white'
          >
            {Password.current &&
            Username.current &&
            Password.current.value.length > 6 &&
            Username.current.value ? (
              ''
            ) : (
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <LockClosedIcon
                  className='h-5 w-5 text-white group-hover:text-indigo-400'
                  aria-hidden='true'
                />
              </span>
            )}
            Log In
          </motion.button>
          <br />
          <div className='flex justify-center'>
            <p className='text-gray-400'>
              Don't have an account?
              <Link
                className='text-rose-500 ml-2 hover:underline focus:underline'
                to='/signup'
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

import React from "react";
import { useAppSelector } from "../redux/hooks";

export const AccountPage = () => {
  const user = useAppSelector((state) => state.user.user);
  console.log(user);
  return (
    <div className="w-full flex justify-center">
      <div className="w-11/12 mb-20">
        <h1 className="text-blue-500 text-2xl mb-4">Account Details</h1>
        <div className="mb-10">
          <h1 className="text-xl mb-4">Current Opal Account Information</h1>
          <div className="flex justify-between w-1/5">
            <h2 className="">Username:&nbsp;&nbsp;</h2>
            <h2 className="">{user.username}</h2>
          </div>
          <div className="flex justify-between w-1/5">
            <h2 className="">First Name:&nbsp;&nbsp;</h2>
            <h2 className="">{user.firstname}</h2>
          </div>
          <div className="flex justify-between w-1/5">
            <h2 className="">Last Name:&nbsp;&nbsp;</h2>
            <h2 className="">{user.lastname}</h2>
          </div>
          <div className="flex justify-between w-1/5">
            <h2 className="">Email:&nbsp;&nbsp;</h2>
            <h2 className="">{user.email}</h2>
          </div>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="flex justify-center items-center bg-white drop-shadow-xl p-5 w-full xl:w-2/3 border-2 rounded space-x-10">
            <div className="w-2/3">
              <h1 className="mb-6 text-xl">
                Please edit any the fields you would like to change.
              </h1>
            </div>
            <div className="w-full grid">
              <div className='flex flex-col p-2'>
                <label className='mb-2' htmlFor="">First Name</label>
                <input
                  placeholder="Enter your first name..."
                  className="border-2 border-sky-500 py-3 px-4 rounded-lg"
                  type="text"
                />
              </div>
              <div className='flex flex-col p-2'>
                <label className='mb-2' htmlFor="">Last Name</label>
                <input
                  placeholder="Enter your last name..."
                  className="border-2 border-sky-500 py-3 px-4 rounded-lg"
                  type="text"
                />
              </div>
              <div className='flex flex-col p-2'>
                <label className='mb-2' htmlFor="">Username</label>
                <input
                  placeholder="Enter your username..."
                  className="border-2 border-sky-500 py-3 px-4 rounded-lg"
                  type="text"
                />
              </div>
              <div className='flex flex-col p-2'>
                <label className='mb-2' htmlFor="">Email</label>
                <input
                  placeholder="Enter your email..."
                  className="border-2 border-sky-500 py-3 px-4 rounded-lg"
                  type="text"
                />
              </div>
              <div className='flex flex-col p-2'>
                <label className='mb-2' htmlFor=""> Password</label>
                <input
                  placeholder="Enter your password..."
                  className="border-2 border-sky-500 py-3 px-4 rounded-lg"
                  type="text"
                />
              </div>
              <button className="bg-sky-500 mt-4 mb-4 w-full p-4 rounded-lg text-white">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

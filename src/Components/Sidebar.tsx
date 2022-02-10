import React, { useState } from "react";

import { motion } from "framer-motion";
import { changeTab } from "../redux/slices/dashSlice";
import {
  UserIcon,
  CloudIcon,
  BookOpenIcon,
  LogoutIcon,
  CubeTransparentIcon,
  ChartBarIcon,
} from "@heroicons/react/outline";

import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";

export const Sidebar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [sidebarActive, setSidebarActive] = useState<boolean>();

  const Tab = useAppSelector((state) => state.dash.tab);

  return (
    <div
      className="open relative left-0 transition-all hover:transition-all ease-in-out h-screen bg-[#363740] flex  scrollbar-hide flex-col items-center overflow-x-hidden"
      onMouseLeave={() => setSidebarActive(false)}
      onMouseEnter={() => setSidebarActive(true)}
    >
      <br />
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center bg-sky-500 p-2 rounded-full">
          <motion.img
            className="rotate w-12 h-12"
            src="../../assets/images/Opal Logo No Background.png"
            alt="Opal Logo Red Background"
          />
        </div>
        {sidebarActive ? (
          <p className="text-2xl mt-3 text-gray-400">Opal</p>
        ) : (
          <p className="text-2xl mt-3 text-[#363740]">Opal</p>
        )}
      </div>
      <br />
      {sidebarActive ? (
        <p className="text-white text-2xl whitespace-nowrap">Azure Dashboard</p>
      ) : (
        <p className="text-[#363740] whitespace-nowrap text-2xl">A</p>
      )}
      <br />
      <div className="w-full">
        <div
          onClick={() => {
            dispatch(changeTab("Overview"));
            navigate("/azure/overview");
          }}
          className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? "" : "justify-center"
          } `}
        >
          <NavLink
            to="/azure/overview"
            className={({ isActive }) =>
              isActive ? "bg-gray-500 bg-opacity-40 p-2 rounded-md w-full" : ""
            }
          >
            <div className={`flex items-center w-full`}>
              <ChartBarIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? "mr-6" : ""
                }`}
              />
              {sidebarActive ? (
                <h1 className="hidden md:inline-block">Overview</h1>
              ) : (
                ""
              )}
            </div>
          </NavLink>
        </div>

        <div
          onClick={() => {
            dispatch(changeTab("Functions"));
            navigate("/azure/functionApp");
          }}
          className={` focus:text-blue-500 whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? "" : "justify-center"
          }`}
        >
          <NavLink
            to="/azure/functionApp"
            className={({ isActive }) =>
              isActive ? "bg-gray-500 bg-opacity-40 p-2 rounded-md w-full" : ""
            }
          >
            <div className={`flex items-center w-full`}>
              <CubeTransparentIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? "mr-6" : ""
                }`}
              />
              {sidebarActive ? <h1>FunctionApps</h1> : ""}
            </div>
          </NavLink>
        </div>

        <div
          onClick={() => {
            dispatch(changeTab("Func Details"));
            navigate("/azure/functions");
          }}
          className={`focus:text-blue-500 whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? "" : "justify-center"
          }`}
        >
          <NavLink
            to="/azure/functions"
            className={({ isActive }) =>
              isActive ? "bg-gray-500 bg-opacity-40 p-2 rounded-md w-full" : ""
            }
          >
            <div className={`flex items-center w-full`}>
              <CloudIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? "mr-6" : ""
                }`}
              />
              {sidebarActive ? <h1>Functions</h1> : ""}
            </div>
          </NavLink>
        </div>

        <div
          onClick={() => {
            dispatch(changeTab("Summary"));
            navigate("/azure/summary");
          }}
          className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? "" : "justify-center"
          }`}
        >
          <NavLink
            to="/azure/summary"
            className={({ isActive }) =>
              isActive ? "bg-gray-500 bg-opacity-40 p-2 rounded-md w-full" : ""
            }
          >
            <div className={`flex items-center w-full`}>
              <BookOpenIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? "mr-6" : ""
                }`}
              />
              {sidebarActive ? <h1>Summary</h1> : ""}
            </div>
          </NavLink>
        </div>

        <div
          onClick={() => {
            dispatch(changeTab("Account"));
            navigate("/azure/account");
          }}
          className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
            sidebarActive ? "" : "justify-center"
          }`}
        >
          <NavLink
            to="/azure/account"
            className={({ isActive }) =>
              isActive ? "bg-gray-500 bg-opacity-40 p-2 rounded-md w-full" : ""
            }
          >
            <div className={`flex items-center w-full`}>
              <UserIcon
                className={`text-white w-10 h-10 ${
                  sidebarActive ? "mr-6" : ""
                }`}
              />
              {sidebarActive ? <h1>Account</h1> : ""}
            </div>
          </NavLink>
        </div>
      </div>
      <br />
      <div
        onClick={() => window.location.replace("/")}
        className={`whitespace-nowrap flex items-center text-white p-5 w-full cursor-pointer hover:bg-gray-500 lg:absolute bottom-0 hover:bg-opacity-20 hover:border-l-4 hover:border-white ${
          sidebarActive ? "" : "justify-center"
        }`}
      >
        <LogoutIcon
          className={`text-white w-10 h-10 ${sidebarActive ? "mr-6" : ""}`}
        />
        {sidebarActive ? <h1>Logout</h1> : ""}
      </div>
    </div>
  );
};

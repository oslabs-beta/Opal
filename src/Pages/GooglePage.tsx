import React from "react";
import { Outlet } from "react-router-dom";

// Components
import { DashNav, Sidebar } from "../Components";

export const GooglePage = () => {
  return (
    <div className="h-screen w-full flex">
      <Sidebar />
      <div className="flex-grow w-full bg-white relative">
        <DashNav />

        <div className="mt-40 w-full flex justify-center">
          <img src="../../assets/images/graphTrend.png" alt="" />
        </div>
        <div className="mt-32 flex justify-center">
          <img src="../../assets/images/graph.png" alt="" />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

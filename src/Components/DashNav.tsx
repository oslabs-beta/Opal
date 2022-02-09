import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export const DashNav = () => {
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const location = useLocation();
  const route = location.pathname.split('/');

  return (
    <div className="sticky top-0 z-10 mb-10 w-full bg-white h-28 drop-shadow-lg flex items-center justify-center">
      <div className="w-11/12 h-4/6 flex justify-between items-center">
        <div className="text-3xl font-medium">{ route[route.length - 1][0].toUpperCase() }{ route[route.length - 1].slice(1) }</div>
        <div className="flex items-center">
          <h1 className=" font-medium text-lg">
            {user.firstname[0].toUpperCase() + user.firstname.slice(1)}{" "}
            {user.lastname[0].toUpperCase() + user.lastname.slice(1)}
          </h1>
          <div className="ml-4 cursor-pointer" onClick={() => navigate('/azure/account')}>
            <img
              className="w-12 h-11 rounded-full"
              src="../../assets/images/pfp.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

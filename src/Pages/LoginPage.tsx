import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LockClosedIcon } from "@heroicons/react/solid";
import "./animation.css";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import { refObj } from "../../Types";
import { Loader } from "../Components";

interface dataObject {
  User: string;
  Password: string;
}

export const LoginPage = () => {
  const [error, setError] = useState(false);
  const [userErr, setUserErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);

  const User = useRef<refObj>(null);
  const Password = useRef<refObj>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit() {
    setLoading(true);
    setUserErr(false);
    setPasswordErr(false);

    const data: dataObject = {
      User: User.current!.value,
      Password: Password.current!.value,
    };

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        setLoading(false);
        return res.json();
      });

      if (response.error) {
        setError(response.msg);
        if (response.errors.user) setUserErr(true);
        if (response.errors.password) setPasswordErr(true);
        User!.current!.value = "";
        Password!.current!.value = "";
      } else {
        navigate("/");
        dispatch(login(response.userInfo));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleKeyDown = e => {
    if(e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="min-h-full h-screen w-full bg-[#363740] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <Loader theme="main" />
      ) : (
        <form className="w-1/4 h-fit rounded bg-white flex flex-col justify-center py-12 px-9">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center flex-col">
              <div className="flex justify-center bg-rose-500 p-1.5 rounded-full">
                <motion.img
                  className="rotate w-14 h-14"
                  src="../../assets/images/Opal Logo No Background.png"
                  alt="Opal Logo Red Background"
                />
              </div>
              <p className="text-2xl mt-3 text-gray-400">Opal</p>
            </div>
            <p className="text-center text-gray-400 mt-1.5">
              Enter your email and password below
            </p>
            <br />
            {passwordErr || userErr ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : null}
            <br />
            <label
              className={`text-sm mb-1.5 text-gray-400 ${
                userErr ? "text-red-500" : ""
              }`}
            >
              * EMAIL OR USERNAME
            </label>
            <input
              onChange={() => setUserErr(false)}
              ref={User}
              className={`border-2 mb-4 px-4 py-3 font-light rounded-lg focus:outline-none focus:border-rose-500 focus:border-3 ${
                userErr ? "border-red-500 placeholder:text-red-500" : ""
              }`}
              type="text"
              placeholder="Email Address or Username"
            />

            <label
              className={`text-sm mb-1.5 text-gray-400 ${
                passwordErr ? "text-red-500" : ""
              }`}
            >
              * PASSWORD
            </label>
            <input
              onChange={() => setPasswordErr(false)}
              onKeyPress={handleKeyDown}
              ref={Password}
              className={`border-2 mb-4 px-4 py-3 font-light rounded-lg focus:outline-none focus:border-rose-500 focus:border-3 ${
                passwordErr ? "border-red-500 placeholder:text-red-500" : ""
              }`}
              type="password"
              placeholder="Password"
            />
            <motion.button
              type="button"
              onClick={() => {
                if (Password.current!.value.length >= 6 && User.current!.value)
                  handleSubmit();
                else {
                  setPasswordErr(true);
                  setUserErr(true);
                  // @ts-ignore
                  setError("Password must be at least 6 characters");
                }
              }}
              whileTap={{ scale: 0.9 }}
              animate={{ y: 10 }}
              className="bg-rose-500 mt-4 mb-4 w-full p-4 rounded-lg text-white"
            >
              {Password.current &&
              User.current &&
              Password.current.value.length > 6 &&
              User.current.value ? (
                ""
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-white group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
              )}
              Log In
            </motion.button>
            <br />
            <div className="flex justify-center flex-col">
              <p className="text-gray-400 text-center">
                Don't have an account?
                <Link
                  className="text-rose-500 ml-2 hover:underline focus:underline"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
              <br />
              <Link
                className="text-rose-500 ml-2 hover:underline focus:underline text-center"
                to="/"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

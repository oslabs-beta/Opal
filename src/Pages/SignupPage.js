import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LockClosedIcon } from "@heroicons/react/solid";
import "./animation.css";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";

function Signup() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [usernameErr, setUsernameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [firstNErr, setFirstNErr] = useState(false);
  const [lastNErr, setLastNErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [confirmErr, setConfirmErr] = useState(false);

  const Username = useRef(null);
  const Email = useRef(null);
  const FirstName = useRef(null);
  const LastName = useRef(null);
  const Password = useRef(null);
  const ConfirmPass = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setErrorMsg(false);
    setUsernameErr(false);
    setEmailErr(false);
    setFirstNErr(false);
    setLastNErr(false);
    setPassErr(false);
    setConfirmErr(false);

    const data = {
      Username: Username.current.value,
      Email: Email.current.value,
      FirstName: FirstName.current.value,
      LastName: LastName.current.value,
      Password: Password.current.value,
    };

    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((response) => response.json());

      console.log(response);

      if (response.error) {
        setErrorMsg(response.msg);
        if (response.errors.email) { 
          setEmailErr(true);
          Email.current.value = '';
        }
        if (response.errors.username) {
          setUsernameErr(true);
          Username.current.value = '';
        }

        if (response.errors.all) {
          setEmailErr(true);
          setUsernameErr(true);
          setFirstNErr(true);
          setLastNErr(true);
          setPassErr(true);
          setConfirmErr(true);
          Email.current.value = '';
          Username.current.value = '';
          Password.current.value = '';
          LastName.current.value = '';
          FirstName.current.value = '';
        }
      } else {
        navigate('/');
        dispatch(login(response.userInfo));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // console.log(Username.current.value);

  return (
    <div className="min-h-full h-screen w-full bg-[#363740] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form className="w-1/3 h-fit rounded bg-white flex flex-col justify-center py-12 px-9">
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex justify-center bg-rose-500 p-1.5 rounded-full">
              <img
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
          {errorMsg ? (
            <p className="text-red-500 text-center">{errorMsg}</p>
          ) : (
            ""
          )}
          <br />
          <label
            className={`text-sm mb-1.5 text-gray-400 ${
              usernameErr ? "text-red-500" : ""
            }`}
          >
            * USERNAME
          </label>
          <input
            ref={Username}
            className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
              usernameErr ? " border-red-500 placeholder:text-red-500" : ""
            }`}
            type="text"
            placeholder="Min. of 4 characters"
          />

          <label
            className={`text-sm mb-1.5 text-gray-400 ${
              emailErr ? "text-red-500" : ""
            }`}
          >
            * EMAIL
          </label>
          <input
            ref={Email}
            className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
              emailErr ? " border-red-500 placeholder:text-red-500" : ""
            }`}
            type="email"
            placeholder="Email Address"
          />

          <div className="flex w-full">
            <div className="flex flex-col mr-4 w-full">
              <label
                className={`text-sm mb-1.5 text-gray-400 ${
                  firstNErr ? "text-red-500" : ""
                }`}
              >
                * FIRST NAME
              </label>
              <input
                ref={FirstName}
                className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
                  firstNErr ? " border-red-500 placeholder:text-red-500" : ""
                }`}
                type="text"
                placeholder="First Name"
              />
            </div>

            <div className="flex flex-col w-full">
              <label
                className={`text-sm mb-1.5 text-gray-400 ${
                  lastNErr ? "text-red-500" : ""
                }`}
              >
                * LAST NAME
              </label>
              <input
                ref={LastName}
                className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
                  lastNErr ? " border-red-500 placeholder:text-red-500" : ""
                }`}
                type="text"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="flex flex-col w-auto">
            <label
              className={`text-sm mb-1.5 text-gray-400 ${
                passErr ? "text-red-500" : ""
              }`}
            >
              * PASSWORD
            </label>
            <input
              ref={Password}
              className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
                passErr ? " border-red-500 placeholder:text-red-500" : ""
              }`}
              type="password"
              placeholder="Min. of 6 characters"
            />
          </div>

          <div className="flex flex-col w-auto">
            <label
              className={`text-sm mb-1.5 text-gray-400 ${
                confirmErr ? "text-red-500" : ""
              }`}
            >
              * CONFIRM PASSWORD
            </label>
            <input
              ref={ConfirmPass}
              className={`border-2 px-4 mb-3 py-3 rounded-lg font-light focus:outline-none focus:border-rose-500 focus:border-3 ${
                confirmErr ? " border-red-500 placeholder:text-red-500" : ""
              }`}
              type="password"
              placeholder="Re-Type Password"
            />
          </div>

          <motion.button
            type="button"
            onClick={() => {
              setUsernameErr(false);
              setEmailErr(false);
              setPassErr(false);
              setFirstNErr(false);
              setLastNErr(false);
              setConfirmErr(false);
              setPassErr(false);

              if (!Username.current.value) setUsernameErr(true);
              if (!Email.current.value) setEmailErr(true);
              if (!Email.current.value.includes('@')) setEmailErr(true);
              if (!FirstName.current.value) setFirstNErr(true);
              if (!LastName.current.value) setLastNErr(true);
              if (!Password.current.value) setPassErr(true);
              if (!ConfirmPass.current.value) setConfirmErr(true);
              if (Password.current.value.length < 6) setPassErr(true);
              if (!ConfirmPass.current.value !== Password.current.value)
                setConfirmErr(true);

              if (
                !Username.current.value ||
                !Email.current.value ||
                !FirstName.current.value ||
                !LastName.current.value ||
                !Password.current.value ||
                !ConfirmPass.current.value ||
                ConfirmPass.current.value !== Password.current.value ||
                Password.current.value.length < 6 ||
                !Email.current.value.includes('@')
              ) {
                setErrorMsg("Please properly complete the form fields");
              } else handleSubmit();
            }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: 10 }}
            className="bg-rose-500 mt-4 mb-4 w-full p-4 rounded-lg text-white focus:outline-white"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-white group-hover:text-indigo-400"
                aria-hidden="true"
              />
            </span>
            Sign Up
          </motion.button>
          <br />
          <div className="flex justify-center flex-col">
            <p className="text-gray-400 text-center">
              Have an account?
              <Link
                className="text-rose-500 ml-2 hover:underline focus:underline"
                to="/login"
              >
                Log In
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
    </div>
  );
}

export default Signup;

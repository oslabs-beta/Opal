import React from "react";
import { motion } from "framer-motion";

interface Props {
    theme: string
}

export const Loader = ({ theme }:Props) => {
  return (
    <div className="absolute top-0 w-full h-full flex justify-center items-center bg-[#363740]">
      <div className="flex items-center justify-center p-2 rounded-full" style={{backgroundColor: `${theme === 'azure' ? '#0ea5e9' : theme === 'aws' ? '#fea553' : theme === 'google' ? '#78f49b' : theme === 'main' ? '#f43f5e' : null}`}}>
        <motion.img
          className="Loader w-24 h-24"
          src="../../assets/images/Opal Logo No Background.png"
          alt="Opal Logo Red Background"
        />
      </div>
    </div>
  );
};

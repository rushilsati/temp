import React, { useState } from "react";
import {
  MdMic,
  MdMicOff,
  MdPresentToAll,
  MdCallEnd,
  MdCancelPresentation,
} from "react-icons/md";
import {
  HiOutlineVideoCameraSlash,
  HiOutlineVideoCamera,
} from "react-icons/hi2";
import { useEffect } from "react";

const Controls = ({
  screenStream,
  handleScreenSharing,
  handleToggleCamera,
  cameraOff,
  handleToggleMic,
  micOff,
  handleEndCall,
}) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const countTime = () => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(time);
    };

    const timer = setInterval(countTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center px-[30px]  w-full h-[70px] fixed bottom-0 p-[10px]">
      <div className="text-[20px] font-bold text-slate-300 absolute left-[25px]">
        {time}
      </div>
      <div className="flex items-center justify-center gap-[10px]">
        <button
          className={`rounded-[50%] ${
            micOff ? "bg-[#EA4335]" : "bg-[#3c4043]"
          } p-[10px] hover:brightness-125`}
          onClick={handleToggleMic}
        >
          {micOff ? (
            <MdMicOff size={22} color="#fff" />
          ) : (
            <MdMic size={22} color="hsl(0, 0%, 95%)" />
          )}
        </button>
        <button
          className={`rounded-[50%] ${
            cameraOff ? "bg-[#EA4335]" : "bg-[#3c4043]"
          } p-[10px] hover:brightness-125`}
          onClick={handleToggleCamera}
        >
          {cameraOff ? (
            <HiOutlineVideoCameraSlash size={22} color="#fff" />
          ) : (
            <HiOutlineVideoCamera size={22} color="hsl(0, 0%, 95%)" />
          )}
        </button>
        <button
          className={`rounded-[50%] ${
            screenStream ? "bg-[#EA4335]" : "bg-[#3c4043]"
          } p-[10px] hover:brightness-125"`}
          onClick={handleScreenSharing}
        >
          {screenStream ? (
            <MdCancelPresentation size={22} color="#fff" />
          ) : (
            <MdPresentToAll size={22} color="hsl(0, 0%, 95%)" />
          )}
        </button>
        <button
          className="rounded-[50%] bg-[#EA4335] p-[10px] hover:brightness-125"
          onClick={handleEndCall}
        >
          <MdCallEnd size={22} color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default Controls;

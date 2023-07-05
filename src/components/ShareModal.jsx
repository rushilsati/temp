import React from "react";
import { AiOutlineClose, AiOutlineCopy } from "react-icons/ai";

import { WEBSITE_URL } from "../config";

const ShareModal = ({ meetingCode, close }) => {
  return (
    <div className="absolute w-[40%] min-w-[325px] left-[20px] bg-white shadow-md rounded-lg p-[20px] z-[1]">
      <button
        className="absolute top-[13px] right-[20px] hover:brightness-[90%] p-[8px] rounded-[50%] bg-white"
        onClick={close}
      >
        <AiOutlineClose size={18} />
      </button>
      <div className="text-[14px] font-bold text-[hsl(208,100%,50%)] mb-[20px]">
        MEETING SUCCESSFULLY CREATED
      </div>
      <div className="text-gray-600 text-[13px] font-medium mb-[10px]">
        Share this meeting link with others you want in the meeting
      </div>
      <div className="text-[12px] flex justify-between items-center text-gray-800 font-bold bg-gray-200 p-[10px] box-content rounded-[5px] mb-[15px]">
        <span>{`${WEBSITE_URL}/${meetingCode}`}</span>
        <button
          className="p-[10px] rounded-[50%] hover:brightness-[125%] bg-gray-200 flex f-center"
          onClick={() =>
            navigator.clipboard.writeText(`${WEBSITE_URL}/${meetingCode}`)
          }
        >
          <AiOutlineCopy size={20} color="hsl(0, 0%, 35%)" />
        </button>
      </div>
      <div className="text-gray-600 text-[13px] font-medium mb-[10px]">
        Or use the following code to join the meeting
      </div>
      <div className="flex justify-between items-center text-[12px] text-gray-800 font-bold bg-gray-200 p-[10px] box-content rounded-[5px] mb-[25px]">
        <span>{meetingCode}</span>
        <button
          className="p-[10px] rounded-[50%] hover:brightness-[125%] bg-gray-200 flex f-center"
          onClick={() => navigator.clipboard.writeText(`${meetingCode}`)}
        >
          <AiOutlineCopy size={20} color="hsl(0, 0%, 35%)" />
        </button>
      </div>
      <div className="text-[15px] font-bold text-[hsl(208,100%,50%)]">
        HAVE A HAPPY MEETING
      </div>
    </div>
  );
};

export default ShareModal;

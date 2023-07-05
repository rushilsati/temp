import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import { v4 } from "uuid";

import { APP_NAME } from "../config";

const Homepage = () => {
  const [meetingCode, setMeetingCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (meetingCode.trim().length === 0) return;
    navigate(`/${meetingCode.trim()}`);
  };

  const handleStartANewMeeting = () => {
    navigate(`/${v4()}`);
  };


  return (
    <div className="h-full flex justify-center items-center text-[19px]">
      <section className="shadow-lg bg-white p-5 rounded-lg">
        <header className="mb-5">
          <h1 className="text-[25px] font-bold text-gray-600 text-center">
            {APP_NAME}
          </h1>
        </header>
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="text-[12px] font-bold text-gray-600 mb-[10px]">
            HAVE A MEETING CODE?{" "}
          </div>
          <div className="flex items-center justify-between gap-[10px] border-[1px] h-[55px] rounded-[5px] overflow-hidden sm:w-[375px] md:w-[425px] lg:w-[475px] mb-5">
            <label
              className="flex justify-center items-center min-w-[45px]"
              htmlFor="meeting-code"
            >
              <MdPassword size={25} />
            </label>
            <input
              id="meeting-code"
              name="meeting-code"
              value={meetingCode}
              placeholder="Enter meeting code"
              className="flex-1 px-[10px] outline-none"
              onChange={(e) => setMeetingCode(e.target.value)}
            />
          </div>
          <button className="bg-[#0087FF] text-white h-[40px] w-full text-[11px] font-semibold rounded-[5px] hover:brightness-125 active:brightness-125 active:scale-95">
            JOIN MEET
          </button>
        </form>
        <div className="flex items-center justify-center h-[0px] border-t-[1px] border-t-gray-400 mb-10">
          <span className="inline-block bg-white px-[10px] text-[12px] text-gray-400 font-semibold">
            OR
          </span>
        </div>
        <div>
          <div className="text-[12px] font-bold text-gray-600 mb-[10px]">
            CREATE A FRESH MEETING
          </div>
          <button
            className="bg-[#0087FF] text-white h-[40px] w-full text-[11px] font-semibold rounded-[5px] hover:brightness-125 active:brightness-125 active:scale-95"
            onClick={handleStartANewMeeting}
          >
            START A NEW MEETING
          </button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

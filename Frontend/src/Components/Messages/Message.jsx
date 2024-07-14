import React from "react";
import { IoMdSend } from "react-icons/io";

const Message = () => {
  return (
    <>
      <section className="flex lg:h-[502px] h-[400px] w-full flex-col overflow-y-scroll p-4 bg-sky-200">
        <section className="flex-1 pb-5">
        <div className="chat chat-start ">
  <div className="chat-image avatar">
    <div className="w-8 lg:w-10 rounded-full">
      <img
        alt="userImage"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div className="chat-header">
    Obi-Wan Kenobi
    <time className="text-xs opacity-50">12:45</time>
  </div>
  <div className="chat-bubble bg-sky-400 text-white">You were the Chosen One!</div>
  <div className="chat-footer opacity-50">Delivered</div>
</div>
<div className="chat chat-end">
  <div className="chat-image avatar">
    <div className="w-8 lg:w-10 rounded-full">
      <img
        alt="Tailwind CSS chat bubble component"
        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
    </div>
  </div>
  <div className="chat-header">
    Anakin
    <time className="text-xs opacity-50">12:46</time>
  </div>
  <div className="chat-bubble bg-sky-400 text-white">I hate you!</div>
  <div className="chat-footer opacity-50">Seen at 12:46</div>
        </div>
        </section>
        <section className="sticky bottom-0 py-2 pl-1 pr-4 rounded-md bg-sky-400 flex justify-end items-center space-x-4">
          <input
            type="text"
            placeholder="Type here"
            className="input w-full rounded-[35px] lg:focus:mr-[200px] transition-all duration-500"
          />
          <button className="active:text-white active:size-50 transition-all duration-300 ">
            <IoMdSend size={30} />
          </button>
        </section>
      </section>
    </>
  );
};

export default Message;

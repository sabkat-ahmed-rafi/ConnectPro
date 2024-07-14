import React from "react";

const MessageList = () => {
  return (
    <>
      <section className=" w-[25%] lg:h-[502px] h-[400px] flex flex-col overflow-y-scroll bg-sky-400 p-4  border-sky-400">
        <section className="mb-4">
            <input type="search" placeholder="Seach messenger" name="search" className="input input-bordered w-full" />
        </section>
        <section className="">
          <div className="flex justify-between lg:hover:bg-sky-500 hover:text-white transition-all duration-500 items-center lg:space-x-2 lg:px-3 lg:py-2 rounded-lg">
            <img
              alt="Tailwind CSS chat bubble component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              className="w-12 lg:w-12 rounded-full hover:border-black"
            />
            <h1 className="text-[16px] text-white font-bold lg:flex hidden">Sabkat Ahmed Rafi</h1>
          </div>
        </section>
      </section>
    </>
  );
};

export default MessageList;

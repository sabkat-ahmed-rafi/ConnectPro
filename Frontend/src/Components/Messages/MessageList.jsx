import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query"
import { axiosSecure } from "../../Hooks/useAxiosSecure";

const MessageList = () => {

  const [search, setSearch] = useState('')
  const [userUid, setUserUid] = useState('')

  const {data: allUsers = []} = useQuery({
    queryKey: ["userList", search],
    queryFn: async () => {
      const {data} = await axiosSecure.get(`/users?search=${search}`)
      return data
    }
  })


  // have to work on the search bar when a user will select a user from the search appearence i have to hide the appearence section 

 
  console.log(userUid)

  return (
    <>
      <section className=" w-[25%] lg:h-[502px] h-[400px] flex flex-col overflow-y-scroll bg-sky-400 p-4  border-sky-400">
        <section className="mb-4">
            <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search messenger" name="search" className="input input-bordered lg:w-full w-[56px] p-1 lg:p-3" />
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


<section className={`${search ? "visible" : "hidden"} w-[25%] lg:h-[302px] h-[280px] flex flex-col overflow-y-scroll absolute bg-white shadow-lg top-[150px] lg:top-[200px] left-[100px] lg:left-[200px] z-10 p-4 rounded-xl space-y-3`}>
{
        allUsers.map(item => {
          return (
            <section onClick={() => setUserUid(item.uid)}  key={item.uid} className="">
            <div className="flex lg:hover:bg-sky-300 hover:text-white transition-all duration-500 items-center lg:space-x-3 lg:px-3 lg:py-2 rounded-lg">
              <img
                alt="Tailwind CSS chat bubble component"
                src={item.photo}
                className="w-12 lg:w-12 rounded-full hover:border-black"
              />
              <h1 className="text-[16px] text-black font-bold lg:flex hidden">{item.userName}</h1>
            </div>
          </section>
          )
        })
      }
</section>
    </>
  );
};

export default MessageList;

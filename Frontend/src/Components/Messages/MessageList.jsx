import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query"
import { axiosSecure } from "../../Hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const MessageList = ({ onMessageClick }) => {

  const [search, setSearch] = useState('')
  const { user } = useAuth()


  // showing all the users for the search appereance 
  const {data: allUsers = []} = useQuery({
    queryKey: ["userList", search],
    queryFn: async () => {
      const {data} = await axiosSecure.get(`/users?search=${search}`)
      return data
    }
  })

  // showing the conversations left side of the message route 
  const {data: conversations = [], refetch} = useQuery({
    queryKey: ["conversations", user?.email],
    queryFn: async () => {
      const {data} = await axiosSecure.get(`/userConversations?senderEmail=${user?.email}`)
      return data
    },
  })

  // saving each conversation left side of the message route
  const handleSaveConversation = async (item) => {
    const {data} = await axiosSecure.post(`/conversations`, {...item, senderEmail: user.email, senderUid: user.uid, senderPhoto: user.photoURL, senderName: user.displayName})
    console.log(data)
    refetch()
  }
 

  // now I have to conditionally show the each user for the conversation functionality.

  return (
    <>
    {/* conversation appearence  */}
      <section className=" w-[25%] lg:h-[502px] h-[400px] flex flex-col overflow-y-scroll bg-slate-300 p-4 border-r-2 border-sky-500">
        <section className="mb-4">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search messenger" name="search" className="input input-info input-bordered lg:w-full w-[56px] p-1 lg:p-3" />
        </section>
       {
        conversations.map((conversation) =>  <Link key={conversation._id}
        onClick={onMessageClick} 
        to={`/inbox/message/${user?.uid == conversation.receiverUid? conversation.senderUid:conversation.receiverUid }`} className="">
        <div className="flex justify-between lg:hover:bg-sky-400 hover:text-white transition-all duration-500 items-center lg:space-x-2 lg:px-3 lg:py-2 p-2 rounded-lg">
          <img
            alt="profile"
            src={user?.uid == conversation.receiverUid? conversation.senderPhoto:conversation.receiverPhoto}
            className="w-12 lg:w-12 rounded-full hover:border-black"
          />
          <h1 className="text-[16px] text-slate-700 hover:text-white font-semibold lg:flex hidden">{user?.uid == conversation.receiverUid? conversation.senderName:conversation.receiverName}</h1>
        </div>
      </Link>)
       }
      </section>

 {/* search appearence  */}
<section className={`${search ? "visible" : "hidden"} w-[25%] lg:h-[302px] h-[280px] flex flex-col overflow-y-scroll absolute bg-white shadow-lg top-[150px] lg:top-[200px] left-[100px] lg:left-[200px] z-10 p-4 rounded-xl space-y-3`}>
{
        allUsers.map(item => {
          return (
            <Link to={`/inbox/message/${item.uid}`} onClick={() => {
              setSearch('')
              handleSaveConversation(item)
 } }  key={item.uid} className="">
            <div className="flex lg:hover:bg-sky-300 hover:text-white transition-all duration-500 items-center lg:space-x-3 lg:px-3 lg:py-2 rounded-lg">
              <img
                alt="profile"
                src={item.photo}
                className="w-12 lg:w-12 rounded-full hover:border-black"
              />
              <h1 className="text-[16px] text-black font-bold lg:flex hidden">{item.userName}</h1>
            </div>
          </Link>
          )
        })
      }
</section>
    </>
  );
};

export default MessageList;

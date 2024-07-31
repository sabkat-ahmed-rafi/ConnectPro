import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useLoaderData } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../Hooks/useAxiosSecure";



const Message = () => {

  const {socket, user} = useAuth()
  const [messageInput, setMessageInput] = useState('')
  const [message, setMessage] = useState([])

  const selectedUser = useLoaderData()

  const receiverUid = selectedUser.uid;
  const receiverEmail = selectedUser.email;
  console.log(receiverEmail);
  


  const {data: chats = [], refetch} = useQuery({
  queryKey: ["chats", user?.email, receiverEmail],
  queryFn: async () => {
    const {data} = await axiosSecure.get(`/messages?senderEmail=${user?.email}&receiverEmail=${receiverEmail}`)
    console.log(chats);
    return data
  },
  refetchInterval: 500,
  })

  useEffect(() => {
    
      setMessage(chats);
    
  }, [chats]);

  useEffect(() => {
    if(socket) {
        socket.on("private message", (message) => {
            setMessage(prevMessages => [...prevMessages, message]);
        })
    }
}, [socket])





  
  // send message implemented but not checked it works or not 
  const handleSendMessage = () => {
    if(messageInput && socket) {
      // now i have to send all the information about each message in the backend
      socket.emit("private message", {
        receiverUid,
        receiverEmail: selectedUser.email,
        receiverPhoto: selectedUser.photo,
        receiverName: selectedUser.userName,
        senderUid: user?.uid,
        senderEmail: user?.email,
        senderPhoto: user?.photoURL,
        senderName: user?.displayName,
        message: messageInput
      })
      refetch()
      console.log(socket)
      setMessageInput('')
    }
    
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      handleSendMessage();
    }
  }
  
  
  return (
    <>
       <section className="flex lg:h-[502px] h-[400px] w-full flex-col overflow-y-scroll p-4 bg-sky-200">
        <section className="flex-1 pb-5">
          {message.map((chat, index) => (
            <div key={index} className={`chat ${chat.senderUid === user?.uid ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-8 lg:w-10 rounded-full">
                  <img 
                  alt="userImage" 
                  src={chat.senderUid === user?.uid ? user.photoURL : selectedUser.photo} />
                </div>
              </div>
              <div className="chat-header">
                {chat.senderUid === user?.uid ? user.displayName : selectedUser.userName}
                <time className="text-xs opacity-50 pl-1">{new Date(chat.date).toLocaleTimeString()}</time>
              </div>
              <div className="chat-bubble bg-sky-400 text-white">{chat.message}</div>
            </div>
          ))}
        </section>
        <section className="sticky bottom-0 py-2 pl-1 pr-4 rounded-md bg-sky-400 flex justify-end items-center space-x-4">
          <input
            value={messageInput}
            onKeyPress={handleKeyPress}
            onChange={(e) => setMessageInput(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input w-full rounded-[35px] lg:focus:mr-[200px] transition-all duration-500"
          />
          <button onClick={handleSendMessage} className="active:text-white active:size-50 transition-all duration-300">
            <IoMdSend size={30} />
          </button>
        </section>
      </section>
    </>
  );
};

export default Message;

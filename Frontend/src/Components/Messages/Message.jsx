import React, { useEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { Link, useLoaderData } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { axiosSecure } from "../../Hooks/useAxiosSecure";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdVideocam } from "react-icons/io";
import { IoCall } from "react-icons/io5";




// now i have to implement the previous route system but not previous one the it should be the home route 

const Message = () => {

  const {socket, user} = useAuth()
  const [messageInput, setMessageInput] = useState('')
  const [message, setMessage] = useState([])

  const selectedUser = useLoaderData()

  const receiverUid = selectedUser.uid;
  const receiverEmail = selectedUser.email;
  const messageEndRef = useRef(null);
  


  const {data: chats = [], refetch, } = useQuery({
  queryKey: ["chats", user?.email, receiverEmail],
  queryFn: async () => {
    const {data} = await axiosSecure.get(`/messages?senderEmail=${user?.email}&receiverEmail=${receiverEmail}`)
    console.log(chats);
    return data
  },
  refetchInterval: 300,
  })

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }


  useEffect(() => {
    
      setMessage(chats);
    
  }, [chats]);




  useEffect(() => {
    if(socket) {
        socket.on("private message", (newMessage) => {
            setMessage(prevMessages => [...prevMessages, newMessage]);
            scrollToBottom();
        })
    }
}, [socket])



   useEffect(() => {
     scrollToBottom();
    }, [message]);


  
  // send message implemented 
  const handleSendMessage = () => {
    if(messageInput && socket) {
      
      const newMessage = {
        receiverUid,
        receiverEmail: selectedUser.email,
        receiverPhoto: selectedUser.photo,
        receiverName: selectedUser.userName,
        senderUid: user?.uid,
        senderEmail: user?.email,
        senderPhoto: user?.photoURL,
        senderName: user?.displayName,
        message: messageInput
      }

      setMessage(prevMessages => [...prevMessages, newMessage]);
      socket.emit("private message", newMessage)
      setMessageInput('')
      scrollToBottom();
    }
    
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      handleSendMessage();
    }
  }

  if(message.length == 0) {
    return <section className="flex lg:h-[502px] h-[400px] w-full flex-col overflow-y-scroll p-4 bg-sky-200">
       <section className="sticky top-0 z-10 bg-slate-300 border-2 shadow-md shadow-sky-400  border-sky-400 rounded-md p-2 flex items-center space-x-4">
       <Link to={`/`}><IoIosArrowBack /></Link>
        <div className="w-8 lg:w-10 rounded-full">
                  <img 
                  className="rounded-full"
                  alt="userImage" 
                  src={selectedUser.photo} />
        </div>
          <h1 className="lg:text-base text-sm font-semibold">{selectedUser.userName}</h1>
          <div>
          <IoCall className="rounded hover:text-blue-500" size={23} />
          </div>
          <div>
          <IoMdVideocam className="rounded hover:text-blue-500" size={26} />
          </div>
        </section>
      <section className="flex-1 pb-5">
        <h1 className="flex justify-center items-center h-full lg:text-3xl text-xl font-bold text-slate-400">No messages</h1>
      </section>
      <section className="sticky bottom-0 py-2 pl-1 lg:pl-2 pr-4 rounded-md  flex justify-end items-center space-x-4 bg-slate-300 border-2 shadow-md shadow-sky-400 border-sky-400">
          <input
            value={messageInput}
            onKeyPress={handleKeyPress}
            onChange={(e) => setMessageInput(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input-sm lg:input-md w-full rounded-[35px] focus:border-slate-500 focus:outline-none lg:focus:mr-[200px] transition-all duration-500"
          />
          <button onClick={handleSendMessage} className="active:text-white active:size-50 transition-all duration-300">
            <IoMdSend size={30} />
          </button>
        </section>
    </section>
  }
  
  return (
    <>
       <section className="flex lg:h-[502px] h-[400px] w-full flex-col overflow-y-scroll p-4 bg-slate-100">
        <section className="sticky top-0 z-10 bg-slate-300 border-2 shadow-md shadow-sky-400  border-sky-400 rounded-md p-2 flex items-center space-x-4">
        <Link to={`/`}><IoIosArrowBack /></Link>
        <div className="w-8 lg:w-10 rounded-full">
                  <img 
                  className="rounded-full"
                  alt="userImage" 
                  src={selectedUser.photo}/>
        </div>
          <h1 className="lg:text-base text-sm font-semibold">{selectedUser.userName}</h1>
          <div>
          <IoCall className="rounded hover:text-blue-500" size={23} />
          </div>
          <div>
          <Link to={`/inbox/videoCall/${selectedUser.uid}`}><IoMdVideocam className="rounded hover:text-blue-500" size={26} /></Link>
          </div>
        </section>
        <section className="flex-1 pb-5 pt-6">
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
          <div ref={messageEndRef} />
        </section>
        <section className="sticky bottom-0 py-2 pl-1 lg:pl-2 pr-4 rounded-md  flex justify-end items-center space-x-4 bg-slate-300 border-2 shadow-md shadow-sky-400 border-sky-400">
          <input
            value={messageInput}
            onKeyPress={handleKeyPress}
            onChange={(e) => setMessageInput(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input-sm lg:input-md w-full rounded-[35px] focus:border-slate-500 focus:outline-none lg:focus:mr-[200px] transition-all duration-500"
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

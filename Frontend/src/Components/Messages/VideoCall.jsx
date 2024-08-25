import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { MdCallEnd } from "react-icons/md";
import useAuth from '../../Hooks/useAuth';




const VideoCall = () => {

    const callingUser = useLoaderData()
    const { user, socket, previousRoute } = useAuth()
    const navigate = useNavigate()
    console.log(callingUser)
    

    const goPreviousRoute = () => {
      setTimeout(() => {
        if(previousRoute) {
          navigate(previousRoute)
        }
      }, 5000);
    }

    useEffect(() => {
      if(socket) {
        socket.emit("callUser", {receiverSocketId: callingUser.socketId, callerName: user?.displayName, callerPhoto: user?.photoURL})
        goPreviousRoute();
      }
    }, [socket, callingUser, user, previousRoute])

    return (
        <>
          <section className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white'>
            <section className='flex flex-col lg:space-y-60 space-y-40'>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={callingUser.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{callingUser.userName}</h1>
                </div>
                <div className='flex justify-center lg:space-x-56 space-x-28'>
                    <p className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></p>
                </div>
            </section>
          </section>
        </>
    );
};

export default VideoCall;











{/* <section className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white'>
<section className='flex flex-col lg:space-y-60 space-y-40'>
   <div className='flex flex-col justify-center items-center'>
    <div><img className='w-18 rounded-full' src={callingUser.photo} alt="Profile Picture" />      </div>     
      <h1 className='text-2xl'>{callingUser.userName}</h1>
    </div>
    <div className='flex justify-center lg:space-x-56 space-x-28'>
        <p className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></p>
        <p className='bg-green-500 p-4 rounded-full'><FaVideo size={27} /></p>
    </div>
</section>
</section> */}
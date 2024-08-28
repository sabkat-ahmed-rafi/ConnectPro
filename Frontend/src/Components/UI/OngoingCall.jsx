import React, { useEffect, useRef, useState } from 'react';
import { MdCallEnd } from 'react-icons/md';
import useAuth from '../../Hooks/useAuth';

const OngoingCall = ({selectedUser}) => {

  const { socket, isComingCall, callInfo, setIsComingCall, setCallStatus, callStatus } = useAuth()


  useEffect(() => {
    console.log(callInfo)

    if(socket) {

      socket.on("videoCallAccepted", (receivedCallData) => {
        if (receivedCallData) {
          console.log(receivedCallData)
          if (receivedCallData.callStatus === "accepted") {
            setCallStatus("accepted")
            console.log("accepted")
          }
          // Here you can start the video call logic, and also update the call status in the database.
        }
      })
      socket.on("videoCallRejected", (declinedCallData) => {
        if (declinedCallData) {
          console.log(declinedCallData)
          if (declinedCallData.callStatus === "declined") {
            setCallStatus("declined")
            console.log("declined")
          }
          // Here you can show a notification or handle the declined call.
        }
      })
    }



    if(callStatus == "declined" || callStatus == "accepted") {
      const modal = document.getElementById('my_onGoing_modal');
      if (modal) modal.close();
      setCallStatus('')
    }

  }, [callStatus]);


 




  const handleClose = () => {
    console.log("declined");
    setCallStatus('')
      const modal = document.getElementById('my_onGoing_modal');
        if (modal) modal.close();
      if(socket) {
        socket.emit('callerRejected', ({callerSocketId: selectedUser.socketId}))
    }
  }


    return (
        <>
            <dialog id="my_onGoing_modal" className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white modal modal-bottom sm:modal-middle'>
            <section className='flex flex-col lg:space-y-60 space-y-40 modal-box'>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={selectedUser?.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{selectedUser?.displayName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleClose} className='btn bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
            </section>
            </dialog>
        </>
    );
};

export default OngoingCall;
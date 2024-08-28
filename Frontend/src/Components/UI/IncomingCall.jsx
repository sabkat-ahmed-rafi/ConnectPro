import React, { useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from 'react-icons/fa';

const IncomingCall = () => {

  const { socket, isComingCall, callInfo, setIsComingCall, setCallStatus, callStatus } = useAuth()


  const modal = document.getElementById('my_incoming_modal');
  

  useEffect(() => {

    console.log(isComingCall)
    socket?.on("callerVideoCallAccepted", (rejectedCallData) => {
      if (rejectedCallData) {
        console.log(rejectedCallData)
        if (rejectedCallData.callStatus == "rejected") {
          if (modal) modal.close();
          setIsComingCall(false)
        }
        // Here you can show a notification or handle the declined call.
      }
    })





      if (isComingCall== true) {
        if (modal) modal.showModal();
      }

      if(isComingCall == false) {
        if (modal) modal.close();
      }

    }, [socket, isComingCall]);






    const handleDecline = () => {
      console.log("declined")
      const modal = document.getElementById('my_incoming_modal');
      if (modal) modal.close();
      if(socket) {
        setIsComingCall(false)
        socket.emit('rejectVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
    }
    }


    const handleAcceptCall = () => {
      console.log("accepted")
      setIsComingCall(false)
      if(socket) {
        socket.emit('acceptVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
    }
    }

  return (
    <>
      <dialog id="my_incoming_modal" className="flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white modal modal-bottom sm:modal-middle">
        <section className="flex flex-col lg:space-y-60 space-y-40 modal-box">
          <div className="flex flex-col justify-center items-center">
            <div>
              <img
                className="w-18 rounded-full"
                src={callInfo?.callerPhoto}
                alt="Profile Picture"
              />
            </div>
            <h1 className="text-2xl">{callInfo?.callerName}</h1>
          </div>
          <div className="flex justify-center lg:space-x-56 space-x-28 modal-action">
            <form method="dialog">
            <button 
              onClick={handleDecline} 
              className="bg-red-500 p-4 rounded-full">
              <MdCallEnd size={27} />
            </button>
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full"
            >
              <FaVideo size={27} />
            </button>
            </form>
          </div>
        </section>
      </dialog>
    </>
  );
};

export default IncomingCall;

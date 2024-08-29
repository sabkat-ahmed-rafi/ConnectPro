import React, { useEffect, useRef, useState } from 'react';
import { MdCallEnd } from 'react-icons/md';
import useAuth from '../../Hooks/useAuth';

const OngoingCall = ({selectedUser, localVideoRef, remoteVideoRef, peerConnectionRef, peerConnection}) => {

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



    if(callStatus == "declined") {
      const modal = document.getElementById('my_onGoing_modal');
      if (modal) modal.close();
      setCallStatus('')
    }

  }, [socket, callStatus]);


 




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
            <dialog id="my_onGoing_modal" className='w-full flex-col p-4 bg-[#232124] text-white modal modal-bottom sm:modal-middle'>
            {/* flex lg:h-[502px] h-[400px] */}
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
            <section className="flex">
               <video ref={localVideoRef} autoPlay playsInline className='w-[300px]'></video>
               <video ref={remoteVideoRef} autoPlay playsInline className='w-[300px]'></video>
            </section>
            </dialog>
        </>
    );
};

export default OngoingCall;



// WebRTC connection 


// const peerConnection = new RTCPeerConnection();

// // When ICE candidates are found, send them to the other peer
// peerConnection.onicecandidate = (event) => {
//   if (event.candidate) {
//     socket.emit('sendIceCandidate', { candidate: event.candidate, receiverSocketId });
//   }
// };

// // Create an offer and send it to the callee
// peerConnection.createOffer()
//   .then(offer => {
//     return peerConnection.setLocalDescription(offer);
//   })
//   .then(() => {
//     socket.emit('sendOffer', { offer: peerConnection.localDescription, receiverSocketId });
//   });

// // Handle answer from the callee
// socket.on('receiveAnswer', ({ answer }) => {
//   peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
// });

// // Receiving ICE candidates from the callee
// socket.on('receiveIceCandidate', ({ candidate }) => {
//   peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
// });

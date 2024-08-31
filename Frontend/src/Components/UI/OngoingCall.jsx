import React, { useEffect, useState } from 'react';
import { MdCallEnd } from 'react-icons/md';
import useAuth from '../../Hooks/useAuth';

const OngoingCall = ({selectedUser, localVideoRef, remoteVideoRef, peerConnection}) => {

  const { socket, callInfo, setCallStatus, callStatus } = useAuth()



  useEffect(() => {

    // Handle incoming answer from callee
    socket.on("receiveAnswer", ({ answer }) => {
      console.log("got the answer from callee");
      if (peerConnection.signalingState !== 'closed') {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle Ice candidate generation 
    if(peerConnection !== null) {
      peerConnection.oniceCandidate = (event) => {
        if(event.candidate) {
          socket.emit("sendIceCandidate", {candidate: event.candidate, receiverSocketId: selectedUser.socketId});
        }
      };
    }

    // Handle incoming ICE candidates from the callee
    socket.on("receiveIceCandidate", ({ candidate }) => {
      if (peerConnection.signalingState !== 'closed') {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    
    // Handle the remote video stream from the callee
    if(peerConnection !== null) {
      peerConnection.ontrack = (event) => {
        if(remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }
    }



    if(socket) {

      socket.on("videoCallAccepted", (receivedCallData) => {
        if (receivedCallData) {
          console.log(receivedCallData)
          if (receivedCallData.callStatus === "accepted") {
            setCallStatus("accepted")
          }
        }
      })
      socket.on("videoCallRejected", (declinedCallData) => {
        if (declinedCallData) {
          console.log(declinedCallData)
          if (declinedCallData.callStatus === "declined") {
            setCallStatus("declined")
          }
        }
      })
    }



    if(callStatus == "declined") {

    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }

    setCallStatus('')

    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }

      const modal = document.getElementById('my_onGoing_modal');
      if (modal) modal.close();
    }



    return () => {
      socket.off("receiveAnswer");
      socket.off("receiveIceCandidate");
      socket.off("videoCallAccepted");
      socket.off("videoCallRejected");
    };


  }, [socket, callStatus]);


 




  const handleClose = () => {
    

    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }

    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }

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
            <section className="flex space-x-3">
               <video ref={localVideoRef} autoPlay playsInline className='w-[300px]'></video>
               <video ref={remoteVideoRef} autoPlay playsInline className='w-[300px]'></video>
            </section>
            </dialog>
        </>
    );
};

export default OngoingCall;



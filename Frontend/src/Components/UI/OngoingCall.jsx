import React, { useEffect, useState } from 'react';
import { MdCallEnd } from 'react-icons/md';
import useAuth from '../../Hooks/useAuth';

const OngoingCall = ({selectedUser, localVideoRef, remoteVideoRef, remoteAudioRef, peerConnection, isAudioCall, setIsAudioCall, localAudioRef}) => {

  const { socket, setCallStatus, callStatus } = useAuth()
  const [time, setTime] = useState(0)
  


  useEffect(() => {


    // Handle incoming answer from callee
    socket.on("receiveAnswer", ({ answer }) => {
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
    
    // Handle the remote video and audio stream from the callee
 if(peerConnection !== null) {
        peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        if (track.kind === "video") {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        } else if (track.kind === "audio") {
          console.log(event.streams[0])
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
        }
      });
    };
  }



    if(socket) {

      socket.on("videoCallAccepted", (receivedCallData) => {
        if (receivedCallData) {
          if (receivedCallData.callStatus === "accepted") {
            setCallStatus("accepted")
          }
        }
      })
      socket.on("videoCallRejected", (declinedCallData) => {
        if (declinedCallData) {
          if (declinedCallData.callStatus === "declined") {
            setCallStatus("declined")
          }
        }
      })
    }

    if(callStatus == "declined") {

    // Turning off local video stream
    if(localVideoRef?.current?.srcObject && !isAudioCall) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    // Turning off remote video stream
    if(remoteVideoRef?.current?.srcObject && !isAudioCall) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }    
    // Turning off remote audio stream 
    if(remoteAudioRef?.current?.srcObject && isAudioCall) {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }
    // Turning off local audio stream
    if(localAudioRef?.current?.srcObject && isAudioCall) {
      localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      localAudioRef.current.srcObject = null;
    } 

    setCallStatus('')
    setIsAudioCall(false)


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


  }, [socket, callStatus, isAudioCall, selectedUser]);


 




  const handleClose = () => {
    

    // Turning off local video stream
    if(localVideoRef?.current?.srcObject && !isAudioCall) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    // Turning off remote video stream
    if(remoteVideoRef?.current?.srcObject && !isAudioCall) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    // Turning off remote audio stream
    if(remoteAudioRef?.current?.srcObject && isAudioCall) {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }
    // Turning off local audio stream
    if(localAudioRef?.current?.srcObject && isAudioCall) {
      localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      localAudioRef.current.srcObject = null;
    }   


   

    // Close the peer connection
    if(peerConnection && peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }

    setCallStatus('')
    setIsAudioCall(false)
    
    const modal = document.getElementById('my_onGoing_modal');
    if (modal) modal.close();
    
    
    if(socket) {
      socket.emit('callerRejected', ({callerSocketId: selectedUser.socketId}))
    }


  }


    return (
        <>
            <dialog id="my_onGoing_modal" className={`flex flex-col p-4 text-white modal modal-bottom sm:modal-middle`}>
              {/* UI will be shown when Video or the Audio Call is Ongoing  */}
            <section className={`flex flex-col lg:space-y-60 space-y-56 modal-box  ${callStatus == "accepted" && "hidden"} bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={selectedUser?.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{selectedUser?.userName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleClose} className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
            </section>
            {/* UI will be shown after Caller receives the Video call  */}
            <section className={` ${callStatus == '' && "hidden"} ${isAudioCall && "hidden"} rounded-lg lg:min-w-[600px] md:min-w-[500px] max-h-[800px] flex-col p-0 modal-box overflow-hidden bg-[#232124]`}>
               <video ref={remoteVideoRef} autoPlay playsInline className='lg:w-full md:w-full w-[400px] '></video>
               <video ref={localVideoRef} autoPlay muted playsInline className=' lg:rounded-lg md:rounded-lg lg:w-[200px] md:w-[150px] lg:absolute md:absolute lg:bottom-4 md:bottom-8 lg:right-2 md:right-2'></video>
               <button onClick={handleClose} className='bg-red-500 px-14 py-3 rounded-full lg:absolute md:absolute absolute bottom-[8px] left-[105px]  lg:bottom-5 md:bottom-5 lg:left-56 md:left-48'><MdCallEnd size={27} /></button>
            </section>
            {/* UI will be shown after Caller receives the Audio call  */}
            <section className={`flex ${callStatus == '' && "hidden"} flex-col lg:space-y-60 space-y-56 modal-box ${!isAudioCall && "hidden"} bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={selectedUser?.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{selectedUser?.userName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleClose} className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
                <audio ref={localAudioRef}></audio>
                <audio ref={remoteAudioRef} autoPlay></audio>
            </section>
            </dialog>
        </>
    );
};

export default OngoingCall;



import React, { useEffect, useRef } from 'react';
import { MdCallEnd } from 'react-icons/md';
import useAuth from '../../Hooks/useAuth';

const OngoingCall = ({selectedUser, localVideoRef, remoteVideoRef, remoteAudioRef, peerConnection, isAudioCall, setIsAudioCall}) => {

  const { socket, setCallStatus, callStatus } = useAuth()
  


  useEffect(() => {

    console.log(isAudioCall) 

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
    if(peerConnection !== null && !isAudioCall) {
      peerConnection.ontrack = (event) => {
        console.log(event.streams[0])
        if(remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }
    }
    // Handle the remote audio stream from the callee 
    if(peerConnection !== null && isAudioCall) {
      peerConnection.ontrack = (event) => {
        if(remoteAudioRef.current) {
          console.log(event.streams[0])
          remoteAudioRef.current.srcObject = event.streams[0]
          remoteAudioRef.current.play();
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
    if(localVideoRef && localVideoRef.current.srcObject && !isAudioCall) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }

    // Turning off audio 
    if(remoteAudioRef && remoteAudioRef.current.srcObject && isAudioCall) {
      const stream = remoteAudioRef.current.srcObject;
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


  }, [socket, callStatus, isAudioCall]);


 




  const handleClose = () => {
    

    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject && isAudioCall == false) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }


    // This will work when i make the audio functionality in the both side because there is no voices coming from the callee, the reason is the callee side's code is yet to write
    if(remoteAudioRef && remoteAudioRef.current.srcObject) {
      const stream = remoteAudioRef.current.srcObject;
      stream.getAudioTracks().forEach(track => track.stop())
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
              {/* Show UI when Video or the Audio Call is Ongoing  */}
            <section className={`flex flex-col lg:space-y-60 space-y-56 modal-box  ${callStatus == "accepted" && "hidden"} bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={selectedUser?.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{selectedUser?.displayName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleClose} className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
            </section>
            {/* Show UI after Caller receives the Video call  */}
            <section className={` ${callStatus == '' && "hidden"} ${isAudioCall && "hidden"} rounded-lg lg:min-w-[600px] md:min-w-[500px] max-h-[800px] flex-col p-0 modal-box overflow-hidden bg-[#232124]`}>
               <video ref={remoteVideoRef} autoPlay playsInline className='lg:w-full md:w-full w-[400px] '></video>
               <video ref={localVideoRef} autoPlay playsInline className=' lg:rounded-lg md:rounded-lg lg:w-[200px] md:w-[150px] lg:absolute md:absolute lg:bottom-4 md:bottom-8 lg:right-2 md:right-2'></video>
               <button onClick={handleClose} className='bg-red-500 px-14 py-3 rounded-full lg:absolute md:absolute absolute bottom-[8px] left-[105px]  lg:bottom-5 md:bottom-5 lg:left-56 md:left-48'><MdCallEnd size={27} /></button>
            </section>
            {/* Show UI after Caller receives the Audio call  */}
            <section className={`flex ${callStatus == '' && "hidden"} flex-col lg:space-y-60 space-y-56 modal-box ${!isAudioCall && "hidden"} bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={selectedUser?.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{selectedUser?.displayName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleClose} className='bg-purple-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
                <audio ref={remoteAudioRef} autoPlay playsInline></audio>
            </section>
            </dialog>
        </>
    );
};

export default OngoingCall;



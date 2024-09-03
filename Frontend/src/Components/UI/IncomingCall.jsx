import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from 'react-icons/fa';



const IncomingCall = () => {

  const { socket, isComingCall, callInfo, setIsComingCall } = useAuth()
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isAccepted, setIsAccepted] = useState(false);
  
  const modal = document.getElementById('my_incoming_modal');
  
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    peerConnectionRef.current = pc;
    return pc;
  }
  
  useEffect(() => {
    console.log(isComingCall)
    
    const peerConnection = createPeerConnection();

    if(isComingCall) {
    // Capture video and audio
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      // Display the local video (self-view) on the webpage
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Add the stream to the peer connection
      if (peerConnection.signalingState !== 'closed') {
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      }

    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });


      // Handle Ice candidate generation 
      peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', {
          candidate: event.candidate, 
          receiverSocketId: callInfo.callerSocketId,
        });
      }
    };


    // Handle incoming ICE candidates from the caller 
    socket.on("receiveIceCandidate", ({ candidate }) => {
      if (peerConnection.signalingState !== 'closed') {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Handle remote video stream from the caller
    peerConnection.ontrack = (event) => {
      if(remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    }




    socket?.on("callerVideoCallRejected", (rejectedCallData) => {
  if (rejectedCallData) {
        console.log(rejectedCallData)
    if (rejectedCallData.callStatus == "rejected") {
      setIsAccepted(false);
    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }
    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }          
    setIsComingCall(false)
    if (modal) modal.close();
        }
      }

    })


     // Handle incoming offer from the caller
      socket?.on("receiveOffer", ({ offer, callerSocketId }) => {
        console.log("Received offer from caller:", offer);
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      });


      if (isComingCall== true) {
        if (modal) modal.showModal();
      }



    }, [socket, isComingCall]);






    const handleDecline = () => {

      const peerConnection = peerConnectionRef.current;
      const modal = document.getElementById('my_incoming_modal');

    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop())
    }

    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }      

    setIsComingCall(false)

    if (modal) modal.close();

      if(socket) {
        setIsAccepted(false)
        socket.emit('rejectVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
      }
    }


    const handleAcceptCall = () => {
      const peerConnection = peerConnectionRef.current;
      const modal = document.getElementById('my_incoming_modal');
      if (modal) modal.showModal();
      if(socket) {
        socket.emit('acceptVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
        setIsAccepted(true)

     // Create and send the answer
      peerConnection.createAnswer()
      .then(answer => {
        return peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        socket.emit("sendAnswer", {
          answer: peerConnection.localDescription,
          callerSocketId: callInfo.callerSocketId
        });
      })
      .catch(error => {
        console.error("Error creating or sending answer:", error);
      });


    }

    }



  return (
    <>
      <dialog id="my_incoming_modal" className="flex flex-col p-4 text-white modal modal-bottom sm:modal-middle">
        <section className={`flex min-h-[500px] flex-col lg:space-y-60 space-y-56 modal-box ${isAccepted && "hidden"} bg-[#232124] rounded-lg`}>
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
            </form>
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full animate-bounce"
            >
              <FaVideo size={27} />
            </button>
          </div>
        </section>
            <section className={` ${!isAccepted && "hidden"} rounded-lg lg:min-w-[600px] md:min-w-[500px] max-h-[800px] flex-col p-0 modal-box overflow-hidden bg-[#232124]`}>
            <video ref={remoteVideoRef} autoPlay playsInline className='lg:w-full md:w-full w-[400px] '></video>
               <video ref={localVideoRef} autoPlay playsInline className='lg:rounded-lg md:rounded-lg lg:w-[200px] md:w-[150px] lg:absolute md:absolute lg:bottom-4 md:bottom-8 lg:right-2 md:right-2'></video>
               <button onClick={handleDecline} className='bg-red-500 px-14 py-3 rounded-full lg:absolute md:absolute absolute bottom-[8px] left-[105px]  lg:bottom-5 md:bottom-5 lg:left-56 md:left-48'><MdCallEnd size={27} /></button>
            </section>
            <section className="hidden">
              <audio ref={remoteAudioRef}></audio>
            </section>
      </dialog>
    </>
  );
};

export default IncomingCall;
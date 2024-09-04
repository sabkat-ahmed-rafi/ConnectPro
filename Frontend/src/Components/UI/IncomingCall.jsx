import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";



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
  
  console.log(callInfo?.callType)

  useEffect(() => {
    
    const peerConnection = createPeerConnection();

    if(isComingCall) {
    // Capture video and audio
      if(callInfo?.callType == "audio") {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
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
      } else if(callInfo?.callType == "video") {
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
      }


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

    // Handle remote video Or audio stream from the caller
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        if (track.kind === "video") {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        } else if (track.kind === "audio") {
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0];
        }
      });
    };
    

    }




    socket?.on("callerVideoCallRejected", (rejectedCallData) => {
  if (rejectedCallData) {
        
    if (rejectedCallData.callStatus == "rejected") {
      setIsAccepted(false);
    // Turning off video and audio
    if(localVideoRef && localVideoRef.current.srcObject && callInfo?.callType == "video") {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    // Turning off audio 
    if(remoteAudioRef && remoteAudioRef.current.srcObject && callInfo?.callType == "audio") {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
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
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      });


      if (isComingCall== true) {
        if (modal) modal.showModal();
      }



    }, [socket, isComingCall, callInfo]);



    useEffect(() => {
      return () => {

    // Clean up streams and peer connection
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteAudioRef.current?.srcObject) {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }

    if (peerConnectionRef.current) {
      if (peerConnectionRef.current.signalingState !== 'closed') {
        peerConnectionRef.current.close();
      }
      peerConnectionRef.current = null;
    }

        socket?.off("receiveOffer");
        socket?.off("receiveIceCandidate");
        socket?.off("callerVideoCallRejected");
      };
    }, [socket]);



    const handleDecline = () => {

      const peerConnection = peerConnectionRef.current;
      const modal = document.getElementById('my_incoming_modal');


    // Turning off video and audio
    if(localVideoRef?.current?.srcObject && callInfo?.callType == "video") {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    // Turning off audio 
    if(remoteAudioRef?.current?.srcObject && callInfo?.callType == "audio") {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => console.log(track.stop()));
      remoteAudioRef.current.srcObject = null;
    }
    

    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }      

    setIsComingCall(false)
    setIsAccepted(false)

      if (modal) modal.close();

      if(socket) {
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
        {/* This UI will be shown at the time when an incoming call will come   */}
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
           { callInfo?.callType == "video" ? <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full animate-bounce"
            >
              <FaVideo size={27} />
            </button>
            :
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full"
            ><FaPhoneAlt /></button> }
          </div>
        </section>
        {/* This UI will be shown after the Video Call received  */}
            <section className={` ${!isAccepted && "hidden"} ${callInfo?.callType == "audio" && "hidden"} rounded-lg lg:min-w-[600px] md:min-w-[500px] max-h-[800px] flex-col p-0 modal-box overflow-hidden bg-[#232124]`}>
            <video ref={remoteVideoRef} autoPlay playsInline className='lg:w-full md:w-full w-[400px] '></video>
               <video ref={localVideoRef} autoPlay muted playsInline className='lg:rounded-lg md:rounded-lg lg:w-[200px] md:w-[150px] lg:absolute md:absolute lg:bottom-4 md:bottom-8 lg:right-2 md:right-2'></video>
               <button onClick={handleDecline} className='bg-red-500 px-14 py-3 rounded-full lg:absolute md:absolute absolute bottom-[8px] left-[105px]  lg:bottom-5 md:bottom-5 lg:left-56 md:left-48'><MdCallEnd size={27} /></button>
            </section>
            {/* This UI will be shown after the Audio Call received */}
            <section className={`${!isAccepted && "hidden"} flex ${callInfo?.callType == "audio" ? "flex" : "hidden"} flex-col lg:space-y-60 space-y-56 modal-box bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={callInfo?.callerPhoto} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{callInfo?.callerName}</h1>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleDecline} className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></button>
                </form>
                </div>
                <audio ref={remoteAudioRef} autoPlay></audio>
            </section>
      </dialog>
    </>
  );
};

export default IncomingCall;
import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";



const IncomingCall = () => {

  const { socket, isComingCall, callInfo, setIsComingCall } = useAuth()
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localAudioRef = useRef(null)
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [time, setTime] = useState(0);
  
  const modal = document.getElementById('my_incoming_modal');
  
  const createPeerConnection = () => {
    const iceServers = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        },
        {
          urls: 'stun:stun1.l.google.com:19302'
        },
        {
          urls: 'stun:stun2.l.google.com:19302'
        },
        { 
          urls: 'turn:192.158.29.39:3478?transport=udp',
          username: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          credential: '28224511:1379330808'
        }
      ]
    };
  
    const pc = new RTCPeerConnection(iceServers); 
    peerConnectionRef.current = pc;
    return pc;
  }
  
  


  useEffect(() => {
    
    const peerConnection = createPeerConnection();

    if(isComingCall) {
    // Capture video and audio
      if(callInfo?.callType == "audio") {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Display the local video (self-view) on the webpage
          if (localAudioRef.current) {
            localAudioRef.current.srcObject = stream;
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
      if(peerConnection !== null) {
      peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('sendIceCandidate', {
          candidate: event.candidate, 
          receiverSocketId: callInfo.callerSocketId,
        });
      }
    };
    }


    // Handle incoming ICE candidates from the caller 
    socket.on("receiveIceCandidate", ({ candidate }) => {
      if (peerConnection.signalingState !== 'closed') {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(error => console.error('Error adding received ICE candidate in incoming', error));
      }
    });

    // Handle remote video Or audio stream from the caller
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

    socket?.on("callerVideoCallRejected", (rejectedCallData) => {
  if (rejectedCallData) {
        
    if (rejectedCallData.callStatus == "rejected") {
     
    // Turning off local video stream
    if(localVideoRef && localVideoRef.current.srcObject && callInfo?.callType == "video") {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    // Turning off remote video stream
    if (remoteVideoRef?.current?.srcObject && callInfo?.callType === "video") {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    // Turning off remote video stream
    if(remoteAudioRef && remoteAudioRef.current.srcObject && callInfo?.callType == "audio") {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }
    // Turning off local audio stream
    if(localAudioRef?.current?.srcObject && callInfo?.callType == "audio") {
      localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      localAudioRef.current.srcObject = null;
    }
    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
    }          
    setIsComingCall(false)
    setIsAccepted(false);
    setTime(0);
    if (modal) modal.close();
        }
    }

    })



     // Handle incoming offer from the caller
     if(peerConnection.signalingState !== "closed") {
      socket?.on("receiveOffer", ({ offer, callerSocketId }) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      });
    }


      if (isComingCall== true) {
        if (modal) modal.showModal();
      }


      return () => {

        socket?.off("receiveOffer");
        socket?.off("receiveIceCandidate");
        socket?.off("callerVideoCallRejected");
      };

    }, [socket, isComingCall, callInfo]);



    useEffect(() => {
      let timer;
      if(isAccepted) {
          timer = setInterval(() => {
              setTime(prevTime => prevTime + 1)
            }, 1000);
      }
      return () => {
        clearInterval(timer);
      };
    }, [isAccepted])



    const formatTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    
     }


    
    const handleDecline = () => {

      const peerConnection = peerConnectionRef.current;

    // Turning off local video stream
    if(localVideoRef?.current?.srcObject && callInfo?.callType == "video") {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    // Turning off remote video stream
    if (remoteVideoRef?.current?.srcObject && callInfo?.callType === "video") {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
    // Turning off remote audio stream
    if(remoteAudioRef?.current?.srcObject && callInfo?.callType == "audio") {
      remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteAudioRef.current.srcObject = null;
    }
    // Turning off local audio stream
    if(localAudioRef?.current?.srcObject && callInfo?.callType == "audio") {
      localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
      localAudioRef.current.srcObject = null;
    }

    


    // Close the peer connection
    if(peerConnection.signalingState !== "closed") {
      peerConnection.close();
      peerConnectionRef.current = null;
    }      

    setIsComingCall(false)
    setIsAccepted(false)
    setTime(0);

      if (modal) modal.close();

      if(socket) {
        socket.emit('rejectVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
      }
    }


    const handleAcceptCall = () => {
      const peerConnection = peerConnectionRef.current;
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
        {/* This UI will be shown at the time when an incoming call will come */}
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
          <div className="flex justify-center lg:space-x-56 space-x-24 modal-action">
            <form method="dialog">
            <button 
              onClick={handleDecline} 
              className="bg-red-500 p-4 rounded-full saturate-150">
              <MdCallEnd size={27} />
            </button>
            </form>
           { callInfo?.callType == "video" ? <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full animate-bounce saturate-150"
            >
              <FaVideo size={27} />
            </button>
            :
            <button
              onClick={handleAcceptCall}
              className="bg-green-500 p-4 rounded-full animate-pulse saturate-150"
            ><FaPhoneAlt size={27} /></button> }
          </div>
        </section>
        {/* This UI will be shown after the Video Call received  */}
            <section className={` ${!isAccepted && "hidden"} ${callInfo?.callType == "audio" && "hidden"} rounded-lg lg:min-w-[600px] md:min-w-[500px] max-h-[800px] flex-col p-0 modal-box overflow-hidden bg-[#232124]`}>
            <video ref={remoteVideoRef} autoPlay playsInline className='lg:w-full md:w-full w-[400px] '></video>
               <video ref={localVideoRef} autoPlay muted playsInline className='lg:rounded-lg md:rounded-lg lg:w-[200px] md:w-[150px] lg:absolute md:absolute lg:bottom-4 md:bottom-8 lg:right-2 md:right-2'></video>
               <button onClick={handleDecline} className='bg-red-500 px-14 py-3 rounded-full lg:absolute md:absolute absolute bottom-[8px] left-[105px]  lg:bottom-5 md:bottom-5 lg:left-56 md:left-48'><MdCallEnd size={27} /></button>
            </section>
            {/* This UI will be shown after the Audio Call received */}
            <section className={`${!isAccepted && "hidden"} flex ${callInfo?.callType == "audio" ? "flex" : "hidden"} flex-col lg:space-y-60 space-y-48 modal-box bg-[#232124] rounded-lg`}>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={callInfo?.callerPhoto} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{callInfo?.callerName}</h1>
                  <h3 className='text-lg'>{formatTime(time)}</h3>
                </div>
                <div className='modal-action flex justify-center lg:space-x-56 space-x-28'>
                <form method="dialog">
                <button onClick={handleDecline} className='bg-red-500 p-4 rounded-full saturate-150'><MdCallEnd size={27} /></button>
                </form>
                </div>
                <audio ref={localAudioRef}></audio>
                <audio ref={remoteAudioRef} autoPlay></audio>
            </section>
      </dialog>
    </>
  );
};

export default IncomingCall;





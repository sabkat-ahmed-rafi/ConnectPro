import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { MdCallEnd } from 'react-icons/md';
import { FaVideo } from 'react-icons/fa';

const IncomingCall = () => {

    const { callInfo, socket } = useAuth();

    

    const handleAcceptCall = () => {
        if(socket) {
            socket.emit('acceptVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
        }
    }

    const handleDecline = () => {
        if(socket) {
            socket.emit('rejectVideoCall', ({callerSocketId: callInfo.callerSocketId, callId: callInfo.callId}))
        }
    }


    if (!callInfo) return <h1>something is wrong!</h1>;

    return (
        <>
            {callInfo && (
            <section className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white'>
                <section className='flex flex-col lg:space-y-60 space-y-40'>
                    <div className='flex flex-col justify-center items-center'>
                        <div><img className='w-18 rounded-full' src={callInfo?.callerPhoto} alt="Profile Picture" /></div>     
                        <h1 className='text-2xl'>{callInfo?.callerName}</h1>
                    </div>
                    <div className='flex justify-center lg:space-x-56 space-x-28'>
                        <p onClick={handleDecline} className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></p>
                        <p onClick={handleAcceptCall} className='bg-green-500 p-4 rounded-full'><FaVideo size={27} /></p>
                    </div>
                </section>
            </section>
        )}
        </>
    );
};

export default IncomingCall;
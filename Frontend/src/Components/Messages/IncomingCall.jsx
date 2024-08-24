import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { MdCallEnd } from 'react-icons/md';
import { FaVideo } from 'react-icons/fa';

const IncomingCall = () => {


    const { callerInfo } = useAuth();




    if (!callerInfo) return <h1>something is wrong!</h1>;

    return (
        <>
            {callerInfo && (
            <section className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white'>
                <section className='flex flex-col lg:space-y-60 space-y-40'>
                    <div className='flex flex-col justify-center items-center'>
                        <div><img className='w-18 rounded-full' src={callerInfo?.callerPhoto} alt="Profile Picture" /></div>     
                        <h1 className='text-2xl'>{callerInfo?.callerName}</h1>
                    </div>
                    <div className='flex justify-center lg:space-x-56 space-x-28'>
                        <p className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></p>
                        <p className='bg-green-500 p-4 rounded-full'><FaVideo size={27} /></p>
                    </div>
                </section>
            </section>
        )}
        </>
    );
};

export default IncomingCall;
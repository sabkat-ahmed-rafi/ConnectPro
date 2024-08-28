import React from 'react';

const OngoingCall = () => {
    return (
        <>
            <section className='flex lg:h-[502px] h-[400px] w-full flex-col p-4 bg-[#232124] text-white'>
            <section className='flex flex-col lg:space-y-60 space-y-40'>
               <div className='flex flex-col justify-center items-center'>
                <div><img className='w-18 rounded-full' src={callingUser.photo} alt="Profile Picture" />      </div>     
                  <h1 className='text-2xl'>{callingUser.userName}</h1>
                </div>
                <div className='flex justify-center lg:space-x-56 space-x-28'>
                    <p className='bg-red-500 p-4 rounded-full'><MdCallEnd size={27} /></p>
                </div>
            </section>
            </section>
        </>
    );
};

export default OngoingCall;
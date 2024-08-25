import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import { Outlet } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const PlaceHolder = () => {

    const {user} = useAuth()

    return (
        <div className="flex lg:h-[502px] h-[400px] w-full bg-slate-100 ">
            <h1 className='flex items-center justify-center w-full text-2xl font-semibold text-slate-400'>Welcome {user?.displayName}</h1>
        </div>
    );
 }; 


 const Inbox = () => {
     
     const navigate = useNavigate();
     const { socket, setCallerInfo, showOutlet, setShowOutlet } = useAuth();
     const [previousRoute, setPreviousRoute] = useState(null);

     


    // Function to handle message click and show Outlet
    const handleMessageClick = () => {
        setShowOutlet(true);
    };


    // Function to handle incoming call click and show IncomingCall
    const handleIncomingCall = () => {
        setPreviousRoute(window.location.pathname);
        navigate("/inbox/incomingCall");

        setTimeout(() => {
            if (previousRoute) {
                navigate(previousRoute)
            }
        }, 5000);
    }

    useEffect(() => {
    if (socket) {
        socket.on('incomingCall', (data) => {
        handleIncomingCall();
        console.log(data)
        setCallerInfo(data)
        setShowOutlet(true);
        });

        return () => {
            socket.off('incomingCall');
        };
    }

    }, [socket, previousRoute]);



    return (
        <>
            <section className='mt-10 min-h-full flex'>
                <MessageList onMessageClick={handleMessageClick} />
                {showOutlet ? <Outlet /> : <PlaceHolder />}
            </section>
        </>
    );
};

export default Inbox;

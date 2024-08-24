import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const Home = () => {

  const {socket, setCallerInfo, setShowOutlet} = useAuth()

  const navigate = useNavigate()

      // Function to handle incoming call click and show IncomingCall
      const handleIncomingCall = () => {
        navigate("/inbox/incomingCall");
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
    }, [socket]);


    return (
        <>
          rafi
        </>
    );
};

export default Home;
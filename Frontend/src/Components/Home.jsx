import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const Home = () => {

  const {socket, setCallerInfo, setShowOutlet} = useAuth()
  const navigate = useNavigate()

      // Function to handle incoming call click and show IncomingCall
      
      const handleIncomingCall = () => {
        // navigate("/inbox/incomingCall");

        // if(callStatus === "") {
        //     setTimeout(() => {
        //         navigate("/")
        // }, 10000);
        // }

    }




    return (
        <>
          rafi
        </>
    );
};

export default Home;
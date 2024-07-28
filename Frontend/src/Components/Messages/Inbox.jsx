import React from 'react';
import MessageList from './MessageList';
import Message from './Message';
import { Outlet } from 'react-router-dom';

const Inbox = () => {
    return (
        <>
        <section className='mt-10 min-h-full flex  '>
            <MessageList></MessageList>
            <Outlet></Outlet>
        </section>
        </>
    );
};

export default Inbox;
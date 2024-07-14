import React from 'react';
import MessageList from './MessageList';
import Message from './Message';

const Inbox = () => {
    return (
        <>
        <section className='mt-10 min-h-full flex  '>
            <MessageList></MessageList>
            <Message></Message>
        </section>
        </>
    );
};

export default Inbox;
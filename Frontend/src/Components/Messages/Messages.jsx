import React, { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';

const Messages = () => {


    const {socket} = useAuth()
    const [messages, setMessages] = useState([])
    const [messageInput, setMessageInput] = useState('')
    const [recipientId, setRecipientId] = useState('')


    // this block of code always sync the messages for the UI 
    useEffect(() => {
        if(socket) {
            socket.on("private message", (message) => {
                setMessages(prevMessages => [...prevMessages, message]);
            })
        }
    }, [socket])

    // this block of code is the message sending fucntionality 
    const handleSendMessage = () => {
        if(messageInput && socket) {
            socket.emit("private message", {recipientId, message: messageInput})
            console.log('message sent', messageInput)
            setMessageInput('');
        }
    } 

    return (
        <>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sendersId}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Recipient ID"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button className='btn' onClick={handleSendMessage}>Send</button>
            </div>   
        </>
    );
};

export default Messages;
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Community.scss'; // Add some styling later if needed

import { useNavigate } from 'react-router-dom';

import { useUserAuthStore } from '../../store/userAuthStore';
import useAdminStore from '../../store/adminAuthStore';

const socket = io('https://wait-less-backend-2.vercel.app'); // Make sure to replace with your server URL

const Community = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { user } = useUserAuthStore();
    const admins = JSON.parse(localStorage.getItem('admin'));

    const navigate = useNavigate();

    const User = admins ? admins?.name : user?.name;
    useEffect(()=>{
        if(!User){
            navigate("/signup")
        }
    },[User])

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
    
        // Clean up on component unmount
        return () => {
            socket.off('message');
        };
    }, []);
    

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Determine if the sender is an admin or a user
            const senderType = admins ? 'admin' : 'user';
            const fullMessage = {
                sender: User,
                type: senderType,
                text: message,
            };
            
            // Send the message object to the server
            socket.emit('message', fullMessage);
            setMessage(''); // Clear the input field after sending
        }
    };
    

    return (
        <div className="community">
            <h2>Community Chat</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat-message ${msg?.type === 'admin' ? 'admin' : 'user'}`}
                    >
                        <span className="sender-name">{msg?.sender}:</span> {msg?.text}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>

    );
};

export default Community;

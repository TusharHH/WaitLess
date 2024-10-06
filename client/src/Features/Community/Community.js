import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Community.scss'; // Add some styling later if needed

import { useUserAuthStore } from '../../store/userAuthStore';
import useAdminStore from '../../store/adminAuthStore';

const socket = io('http://localhost:4000'); // Make sure to replace with your server URL

const Community = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const { user } = useUserAuthStore();
    const admins = JSON.parse(localStorage.getItem('admin'));

    const User = admins ? admins.name : user.name;

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
            // Send message to the server
            socket.emit('message', `${User}:${message}`);
            setMessage(''); // Clear the input field after sending
        }
    };

    return (
        <div className="community">
            <h2>Community Chat</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        {msg}
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

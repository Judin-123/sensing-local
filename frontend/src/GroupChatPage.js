import React, { useRef, useEffect, useState, useCallback } from "react";
import "./VolunteerDashboard.css";
import axios from "axios";

const GroupChatPage = ({ userData }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            // For now, using mock data since chat API is not yet implemented
            // In real implementation, this would be:
            // const response = await axios.get(`http://localhost:5000/api/chat/messages`);
            // setMessages(response.data.data);

            const mockMessages = [
                { id: 1, sender: "Coordinator", text: "Welcome to the group chat!", timestamp: "2025-07-12 09:00" },
                { id: 2, sender: userData?.name || "You", text: "Hi everyone!", timestamp: "2025-07-12 09:05" },
                { id: 3, sender: "Priya", text: "Looking forward to the next audit.", timestamp: "2025-07-12 09:10" }
            ];
            setMessages(mockMessages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, [userData]);

    useEffect(() => {
        if (userData && userData.id) {
            fetchMessages();
        }
    }, [userData, fetchMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessage = {
                id: Date.now(),
                sender: userData?.name || "You",
                text: input,
                timestamp: new Date().toLocaleString()
            };

            try {
                // In real implementation, this would be:
                // await axios.post(`http://localhost:5000/api/chat/messages`, {
                //     senderId: userData.id,
                //     message: input
                // });

                setMessages([...messages, newMessage]);
                setInput("");
            } catch (error) {
                console.error('Error sending message:', error);
                alert('Failed to send message. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="chat-page">
                <h2 className="page-title">💬 Group Chat</h2>
                <div className="chat-messages" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div>Loading messages...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-page">
                <h2 className="page-title">💬 Group Chat</h2>
                <div className="chat-messages" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <div style={{ color: 'red' }}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page">
            <h2 className="page-title">💬 Group Chat</h2>
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div className={`chat-message ${msg.sender === (userData?.name || "You") ? "chat-message-you" : ""}`} key={msg.id || idx}>
                        <span className="chat-sender">{msg.sender}:</span> {msg.text}
                        <div className="chat-timestamp">{msg.timestamp}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-bar">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button className="chat-send-btn" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChatPage; 
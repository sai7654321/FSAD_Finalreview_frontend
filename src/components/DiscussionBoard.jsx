import React, { useState, useRef, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import "./DiscussionBoard.css";

export default function DiscussionBoard({ project }) {
    const { addMessage } = useProject();
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [project?.messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            await addMessage(project.id, text);
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const messages = project?.messages || [];

    // Format time display
    const formatTime = (time) => {
        if (!time) return "Just now";
        
        try {
            const messageTime = new Date(time);
            const now = new Date();
            const diffMs = now - messageTime;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return "Now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return messageTime.toLocaleDateString();
        } catch {
            return "Recently";
        }
    };

    return (
        <div className="discussion-board">
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map((msg) => {
                        const isMe = msg.sender === user?.name;
                        return (
                            <div 
                                key={msg.id} 
                                className={`message-wrapper ${isMe ? 'message-mine' : 'message-other'}`}
                            >
                                {!isMe && (
                                    <div className="message-avatar">
                                        {msg.sender?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="message-sender">
                                            {msg.sender || "Anonymous"}
                                        </span>
                                        <span className="message-time">
                                            {formatTime(msg.time)}
                                        </span>
                                    </div>
                                    <div className="message-bubble">
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                                {isMe && (
                                    <div className="message-avatar-mine">
                                        {msg.sender?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-messages">
                        <div className="empty-icon">💬</div>
                        <h3>No messages yet</h3>
                        <p>Be the first to start the discussion!</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="message-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message here... (press Enter to send)"
                    disabled={loading}
                    maxLength={500}
                />
                <div className="input-footer">
                    <span className="char-count">
                        {text.length}/500
                    </span>
                    <button 
                        type="submit" 
                        disabled={!text.trim() || loading} 
                        className="send-btn"
                        title="Send message (Enter)"
                    >
                        {loading ? (
                            <Loader size={18} className="spinner" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

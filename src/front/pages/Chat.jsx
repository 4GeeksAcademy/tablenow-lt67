import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Chat = () => {
    const { store, actions } = useGlobalReducer();
    const { restaurantId } = useParams(); 
    const navigate = useNavigate();
    const [text, setText] = useState("");
    const [mode, setMode] = useState("polling"); 
    const scrollRef = useRef(null);

    const goldColor = "#c5a47e";

    const isOwner = !!store.tokenOwner;
    const userType = isOwner ? "owner" : "client";

    const userId = isOwner 
    ? (store.ownerInfo?.id || store.owner?.id || store.user?.id || store.restaurants?.[0]?.owner_id) 
    : (store.clientInfo?.id || store.user?.id);

    const receiverType = isOwner ? "client" : "owner";

    const lastClientMsg = store.chatMessages?.find(m => m.sender_type === "client");
    
    const receiverId = isOwner 
        ? (store.activeChatClient || lastClientMsg?.sender_id || 1) 
        : (restaurantId || 1);

    const fetchMessages = () => {
        if (userId) {
            actions.getMessages(userType, userId);
        }
    };

    const formatLocalTime = (utcDateString) => {
        if (!utcDateString) return "Just now";
        const date = new Date(utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z');
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleClearChat = async () => {
        if (window.confirm("Are you sure? This will permanently delete the chat history.")) {
            const success = await actions.clearChatMessages(userType, userId);
            if (success) {
                alert("Chat cleared successfully");
            } else {
                alert("Could not clear chat or it was already empty.");
            }
        }
    };

    const handleBackNavigation = () => {
        if (isOwner) {
            navigate("/owner-dashboard");
        } else {
            navigate("/client-dashboard");
        }
    };

    useEffect(() => {
        let interval = null;
        if (mode === "polling") {
            interval = setInterval(() => {
                fetchMessages();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [mode, userId]);

    // ==========================================
    // 4. AUTO-SCROLL
    // ==========================================
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [store.chatMessages]);


    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (!userId || !receiverId) {
            console.error("❌ Missing IDs", { userId, receiverId });
            return;
        }

        const success = await actions.sendMessage({
            content: text,
            sender_id: userId,
            sender_type: userType,
            receiver_id: receiverId,
            receiver_type: receiverType,
            restaurante_id: restaurantId || 1
        });

        if (success) setText("");
    };

    return (
        <div className="container-fluid min-vh-100 p-3 p-md-5" 
             style={{ 
                 backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")', 
                 backgroundSize: "cover", 
                 backgroundPosition: "center",
                 backgroundColor: "rgba(0,0,0,0.85)",
                 backgroundBlendMode: "darken"
             }}>
            
            <style>
                {`
                    .custom-placeholder::placeholder {
                        color: ${goldColor} !important;
                        opacity: 0.7;
                    }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    
                    <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
                        <button 
                            className="btn btn-outline-light border-0 d-flex align-items-center"
                            onClick={handleBackNavigation}
                            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                            <i className="fas fa-arrow-left me-2"></i> 
                            Back to Dashboard
                        </button>

                        <div className="d-flex bg-dark p-2 rounded-3 border border-secondary shadow">
                            <span className="me-3 align-self-center text-white small fw-bold">MODE:</span>
                            
                            <button className={`btn btn-sm mx-1 ${mode === 'manual' ? 'btn-primary' : 'btn-outline-light text-white'}`} onClick={() => setMode('manual')}>👆 Manual</button>
                            
                            {isOwner && (
                                <>
                                    <button className={`btn btn-sm mx-1 ${mode === 'polling' ? 'btn-warning text-dark' : 'btn-outline-light text-white'}`} onClick={() => setMode('polling')}>⏱️ Polling</button>
                                    <button className={`btn btn-sm mx-1 ${mode === 'socket' ? 'btn-info' : 'btn-outline-light text-white'}`} onClick={() => setMode('socket')}>⚡ Socket</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card bg-dark border-0 shadow-lg overflow-hidden" style={{ borderRadius: "20px", backgroundColor: "rgba(20, 20, 20, 0.95) !important" }}>
                        
                        {/* CHAT HEADER */}
                        <div className="card-header border-secondary p-3 d-flex justify-content-between align-items-center" style={{ borderBottom: `1px solid ${goldColor}` }}>
                            <div className="d-flex align-items-center text-white">
                                <div className="rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" 
                                     style={{ width: "50px", height: "50px", backgroundColor: goldColor }}>
                                    <i className={`fas ${isOwner ? "fa-user-shield" : "fa-utensils"} text-dark fs-5`}></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold" style={{ color: "white" }}>
                                        {isOwner ? `Owner Chat` : "Chat with Restaurant"}
                                    </h6>
                                    <small className="text-success fw-bold">● Online</small>
                                </div>
                            </div>

                            <div className="btn-group">
                                <button className="btn btn-sm me-2 text-white shadow-sm" 
                                        onClick={handleClearChat} 
                                        style={{ backgroundColor: goldColor, borderRadius: "8px" }}
                                        title="Clear history">
                                    <i className="fas fa-trash-alt me-1"></i> <span className="d-none d-md-inline">Clear</span>
                                </button>
                                <button className="btn btn-sm text-white shadow-sm" 
                                        onClick={fetchMessages}
                                        style={{ backgroundColor: goldColor, borderRadius: "8px" }}
                                        title="Refresh">
                                    <i className="fas fa-sync-alt me-1"></i> <span className="d-none d-md-inline">Refresh</span>
                                </button>
                            </div>
                        </div>

                        {/* CHAT BODY */}
                        <div 
                            className="card-body p-4 custom-scrollbar" 
                            style={{ height: "480px", overflowY: "auto", background: "rgba(0,0,0,0.4)" }}
                            ref={scrollRef}
                        >
                            {store.chatMessages && store.chatMessages.length > 0 ? (
                                store.chatMessages.map((msg, index) => {
                                    const isMe = msg.sender_type === userType;
                                    return (
                                        <div key={index} className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                                            <div 
                                                className={`p-3 position-relative shadow-sm`}
                                                style={{ 
                                                    maxWidth: "75%", 
                                                    borderRadius: isMe ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
                                                    backgroundColor: isMe ? goldColor : "#333",
                                                    color: isMe ? "#000" : "#fff"
                                                }}
                                            >
                                                <p className="mb-1 fw-medium">{msg.content}</p>
                                                <div className="text-end" style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                                                    {formatLocalTime(msg.timestamp)}
                                                    {isMe && <i className="fas fa-check-double ms-1"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center mt-5" style={{ color: goldColor }}>
                                    <i className="fas fa-comments fa-3x mb-3 opacity-50"></i>
                                    <p className="text-white fs-5">No messages yet...</p>
                                    <small className="text-secondary">Start the conversation!</small>
                                </div>
                            )}
                        </div>

                        {/* MESSAGE INPUT */}
                        <div className="card-footer bg-dark border-0 p-3">
                            <form onSubmit={handleSend} className="input-group">
                                <input
                                    type="text"
                                    className="form-control bg-black text-white border-secondary border-end-0 py-3 ps-4 custom-placeholder"
                                    placeholder="Type your message here..."
                                    style={{ borderRadius: "30px 0 0 30px", border: "1px solid #444" }}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <button className="btn px-4 py-3 border-start-0" 
                                        type="submit" 
                                        style={{ borderRadius: "0 30px 30px 0", backgroundColor: goldColor, color: "white" }}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
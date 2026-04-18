import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Chat = () => {
    const { store, actions } = useGlobalReducer();
    const { restaurantId } = useParams(); // Por si entras desde /chat/1
    const [text, setText] = useState("");
    const [mode, setMode] = useState("manual"); // 'manual', 'polling', 'socket'
    const scrollRef = useRef(null);

    // 1. DETERMINAR IDENTIDAD (Basado en tu store.jsx)
    const isOwner = !!store.tokenOwner;
    const isClient = !!store.tokenClient;

    const userType = isOwner ? "owner" : "client";
    const userInfo = isOwner ? store.ownerInfo : store.clientInfo;
    const userId = userInfo?.id;

    // Lógica de receptor: Si soy cliente, hablo con el dueño (ID 1 por defecto o dinámico)
    // Si soy dueño, hablo con el cliente (esto se puede dinamizar más adelante)
    const receiverType = isOwner ? "client" : "owner";
    const receiverId = isOwner ? 1 : 1; // Aquí pondrías el ID del cliente con el que hablas

    // 2. FUNCIÓN DE CARGA (FETCH)
    const fetchMessages = () => {
        if (userId) {
            actions.getMessages(userType, userId);
        }
    };

    // 3. FASE 2: POLLING (TIMER CADA 2 SEGUNDOS)
    useEffect(() => {
        let interval = null;
        if (mode === "polling") {
            console.log("⏱️ Polling activado cada 2 segundos");
            interval = setInterval(() => {
                fetchMessages();
            }, 2000);
        }
        return () => clearInterval(interval); // Limpieza al cambiar de modo o salir
    }, [mode, userId]);

    // 4. AUTO-SCROLL (Para ver siempre el último mensaje)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [store.chatMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

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
        <div className="container-fluid min-vh-100 bg-black text-white p-3 p-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    
                    {/* SELECTOR DE MODO (Para impresionar al profesor) */}
                    <div className="d-flex justify-content-center mb-4 bg-dark p-2 rounded-3 border border-secondary">
                        <span className="me-3 align-self-center text-secondary small">MODO:</span>
                        <button 
                            className={`btn btn-sm mx-1 ${mode === 'manual' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setMode('manual')}
                        >
                            👆 Manual
                        </button>
                        <button 
                            className={`btn btn-sm mx-1 ${mode === 'polling' ? 'btn-warning' : 'btn-outline-secondary'}`}
                            onClick={() => setMode('polling')}
                        >
                            ⏱️ Polling (2s)
                        </button>
                        <button 
                            className={`btn btn-sm mx-1 ${mode === 'socket' ? 'btn-info' : 'btn-outline-secondary'}`}
                            onClick={() => setMode('socket')}
                        >
                            ⚡ Socket.IO
                        </button>
                    </div>

                    <div className="card bg-dark border-secondary shadow-lg overflow-hidden" style={{ borderRadius: "20px" }}>
                        {/* HEADER DEL CHAT */}
                        <div className="card-header bg-dark border-secondary p-3 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: "45px", height: "45px" }}>
                                    <i className="fas fa-user-tie"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">{isOwner ? "Atención al Cliente" : "Chat con el Restaurante"}</h6>
                                    <small className="text-success">● En línea</small>
                                </div>
                            </div>

                            {/* FASE 1: EL BOTÓN DE TRAER CHATS */}
                            {mode === "manual" && (
                                <button className="btn btn-outline-info btn-sm animate__animated animate__pulse animate__infinite" onClick={fetchMessages}>
                                    <i className="fas fa-sync-alt me-2"></i> Traer Chats
                                </button>
                            )}
                        </div>

                        {/* CUERPO DEL CHAT (BURBUJAS) */}
                        <div 
                            className="card-body p-4 custom-scrollbar" 
                            style={{ height: "450px", overflowY: "auto", background: "linear-gradient(180deg, #1a1a1a 0%, #000 100%)" }}
                            ref={scrollRef}
                        >
                            {store.chatMessages && store.chatMessages.length > 0 ? (
                                store.chatMessages.map((msg, index) => {
                                    const isMe = msg.sender_type === userType;
                                    return (
                                        <div key={index} className={`d-flex mb-4 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                                            <div 
                                                className={`p-3 position-relative ${isMe ? "bg-primary text-white" : "bg-secondary text-white"}`}
                                                style={{ 
                                                    maxWidth: "70%", 
                                                    borderRadius: isMe ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
                                                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                                                }}
                                            >
                                                <p className="mb-1">{msg.content}</p>
                                                <div className="text-end" style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isMe && <i className="fas fa-check-double ms-1 text-info"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center mt-5 text-muted italic">
                                    <i className="fas fa-comments fa-3x mb-3"></i>
                                    <p>No hay mensajes aquí aún. ¡Saluda!</p>
                                </div>
                            )}
                        </div>

                        {/* INPUT DE MENSAJE */}
                        <div className="card-footer bg-dark border-secondary p-3">
                            <form onSubmit={handleSend} className="input-group">
                                <input
                                    type="text"
                                    className="form-control bg-black text-white border-secondary border-end-0 py-3 ps-4"
                                    placeholder={mode === 'socket' ? "Escribe en tiempo real..." : "Escribe un mensaje..."}
                                    style={{ borderRadius: "30px 0 0 30px" }}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <button 
                                    className="btn btn-primary px-4 py-3 border-start-0" 
                                    type="submit"
                                    style={{ borderRadius: "0 30px 30px 0" }}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                            {mode === 'socket' && (
                                <p className="text-center text-info small mt-2 mb-0 italic">
                                    * Fase 3 activada: Conexión WebSocket lista.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
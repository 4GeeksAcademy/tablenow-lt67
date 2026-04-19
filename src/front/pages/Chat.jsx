import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Chat = () => {
    const { store, actions } = useGlobalReducer();
    const { restaurantId } = useParams(); 
    const [text, setText] = useState("");
    const [mode, setMode] = useState("manual"); // 'manual', 'polling', 'socket'
    const scrollRef = useRef(null);

    // ==========================================
    // 1. DETERMINAR IDENTIDAD (SÚPER CORREGIDO)
    // ==========================================
    const isOwner = !!store.tokenOwner;
    const userType = isOwner ? "owner" : "client";

    // BUSCAMOS EL ID DEL EMISOR: 
    // Priorizamos ownerInfo que es donde lo guarda tu dispatch según useGlobalReducer
    const userId = isOwner 
        ? (store.ownerInfo?.id || store.owner?.id) 
        : (store.user?.id || store.clientInfo?.id);

    // DETERMINAMOS EL RECEPTOR:
    const receiverType = isOwner ? "client" : "owner";

    // Lógica para receiverId:
    // Si soy owner, busco al cliente en activeChatClient o al último que escribió
    const lastClientMsg = store.chatMessages?.find(m => m.sender_type === "client");
    
    const receiverId = isOwner 
        ? (store.activeChatClient || lastClientMsg?.sender_id || 1) 
        : (restaurantId || 1);

    // ==========================================
    // 2. FUNCIÓN DE CARGA (FETCH)
    // ==========================================
    const fetchMessages = () => {
        if (userId) {
            actions.getMessages(userType, userId);
        } else {
            console.warn("⚠️ No se puede cargar mensajes: userId es undefined");
        }
    };

    // Carga inicial al detectar el userId
    useEffect(() => {
        if (userId) fetchMessages();
    }, [userId]);

    // ==========================================
    // 3. POLLING (TIMER CADA 2 SEGUNDOS)
    // ==========================================
    useEffect(() => {
        let interval = null;
        if (mode === "polling") {
            console.log("⏱️ Polling activado");
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

    // ==========================================
    // 5. MANEJO DE ENVÍO
    // ==========================================
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        // Validación de seguridad para evitar el error 400
        if (!userId || !receiverId) {
            console.error("❌ ERROR CRÍTICO: Faltan IDs para enviar el mensaje", {
                userId,
                receiverId,
                userType,
                ownerInfo: store.ownerInfo
            });
            alert("Error: No se pudo identificar al usuario. Revisa la consola.");
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
        <div className="container-fluid min-vh-100 bg-black text-white p-3 p-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    
                    {/* SELECTOR DE MODO */}
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
                                    <i className={`fas ${isOwner ? "fa-user-shield" : "fa-utensils"}`}></i>
                                </div>
                                <div>
                                    <h6 className="mb-0">{isOwner ? `Respondiendo como Dueño (ID: ${userId})` : "Chat con el Restaurante"}</h6>
                                    <small className="text-success">● En línea</small>
                                </div>
                            </div>

                            {mode === "manual" && (
                                <button className="btn btn-outline-info btn-sm" onClick={fetchMessages}>
                                    <i className="fas fa-sync-alt me-2"></i> Actualizar
                                </button>
                            )}
                        </div>

                        {/* CUERPO DEL CHAT */}
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
                                                    maxWidth: "75%", 
                                                    borderRadius: isMe ? "20px 20px 0px 20px" : "20px 20px 20px 0px",
                                                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                                                }}
                                            >
                                                <p className="mb-1">{msg.content}</p>
                                                <div className="text-end" style={{ fontSize: "0.65rem", opacity: 0.7 }}>
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recién"}
                                                    {isMe && <i className="fas fa-check-double ms-1 text-info"></i>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center mt-5 text-muted">
                                    <i className="fas fa-comments fa-3x mb-3"></i>
                                    <p>No hay mensajes todavía...</p>
                                </div>
                            )}
                        </div>

                        {/* INPUT DE MENSAJE */}
                        <div className="card-footer bg-dark border-secondary p-3">
                            <form onSubmit={handleSend} className="input-group">
                                <input
                                    type="text"
                                    className="form-control bg-black text-white border-secondary border-end-0 py-3 ps-4"
                                    placeholder="Escribe un mensaje..."
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
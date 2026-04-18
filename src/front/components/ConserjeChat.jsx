import React, { useState } from "react";

export const ConserjeChat = () => {
    const [chatInput, setChatInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);

    const handleAskAI = async () => {
        if (!chatInput.trim()) return;
        
        setLoadingAI(true); 
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/conserje", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "query": chatInput })
            });
            const data = await resp.json();  
            setAiResponse(data.respuesta || data.message || "I couldn't find a response.");
        } catch (error) {
            setAiResponse("There was an error connecting to the AI Concierge.");
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="card border-0 shadow-lg p-4 rounded-4" style={{ 
            background: "linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(20, 20, 20, 1) 100%)",
            border: "1px solid rgba(197, 164, 126, 0.2) !important",
            backdropFilter: "blur(10px)"
        }}>
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <div className="p-3 rounded-circle me-3 shadow-lg" style={{ 
                    backgroundColor: "rgba(197, 164, 126, 0.1)", 
                    border: "1px solid #c5a47e" 
                }}>
                    <i className="fas fa-robot fa-lg" style={{ color: "#c5a47e" }}></i>
                </div>
                <div>
                    <h4 className="fw-bold mb-0 text-white" style={{ letterSpacing: "1px" }}>AI CONCIERGE</h4>
                    <p className="small mb-0" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Tell me what you're craving and I'll find the perfect spot.
                    </p>
                </div>
            </div>
            
            {/* Input Group */}
            <div className="input-group mb-2 shadow-lg rounded-pill overflow-hidden p-1" style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
                <input 
                    type="text" 
                    className="form-control border-0 ps-3 bg-transparent text-white" 
                    placeholder="Ex: Recommend a romantic Italian spot..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    style={{ outline: "none", boxShadow: "none" }}
                />
                <button 
                    className="btn rounded-pill px-4 transition-all" 
                    style={{ backgroundColor: "#c5a47e", color: "#000", fontWeight: "bold" }}
                    onClick={handleAskAI} 
                    disabled={loadingAI}
                >
                    {loadingAI ? (
                        <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                        <i className="fas fa-paper-plane"></i>
                    )}
                </button>
            </div>
            
            {/* AI Response Bubble */}
            {aiResponse && (
                <div className="mt-4 p-3 rounded-4 shadow-sm animate__animated animate__fadeIn" style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.03)", 
                    borderLeft: "4px solid #c5a47e",
                    color: "rgba(255, 255, 255, 0.9)"
                }}>
                    <div className="d-flex align-items-start">
                        <i className="fas fa-quote-left me-2 mt-1" style={{ color: "#c5a47e", fontSize: "0.8rem" }}></i>
                        <p className="mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6", fontStyle: "italic" }}>
                            {aiResponse}
                        </p>
                    </div>
                </div>
            )}

            {/* Hint text */}
            {!aiResponse && !loadingAI && (
                <div className="text-center mt-3">
                    <small style={{ color: "rgba(197, 164, 126, 0.4)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Powered by TableNow Intelligence
                    </small>
                </div>
            )}
        </div>
    );
};
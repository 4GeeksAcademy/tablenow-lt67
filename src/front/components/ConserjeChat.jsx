import React, { useState } from "react";

export const ConserjeChat = () => {
    // Estados para manejar el input, la respuesta y el cargando
    const [chatInput, setChatInput] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);

    const handleAskAI = async () => {
        if (!chatInput.trim()) return;
        
        setLoadingAI(true);
        try {
            const resp = await fetch(process.env.BACKEND_URL + "/api/conserje", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "query": chatInput })
            });
            const data = await resp.json();
            
            // Ajusta "data.respuesta" según lo que devuelva tu API
            setAiResponse(data.respuesta || data.message || "No recibí respuesta.");
        } catch (error) {
            setAiResponse("Hubo un error al conectar con el servidor.");
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4 rounded-4" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white p-2 rounded-circle me-3 shadow">
                    <i className="fas fa-robot fa-lg"></i>
                </div>
                <div>
                    <h4 className="fw-bold mb-0 text-dark">Conserje AI</h4>
                    <p className="text-muted small mb-0">Dime qué se te antoja y te recomendaré el lugar perfecto.</p>
                </div>
            </div>
            
            <div className="input-group mb-2 shadow-sm rounded-pill overflow-hidden bg-white p-1">
                <input 
                    type="text" 
                    className="form-control border-0 ps-3" 
                    placeholder="Ej: Recomiéndame un lugar romántico para cenar pasta..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    style={{ outline: "none", boxShadow: "none" }}
                />
                <button 
                    className="btn btn-primary rounded-pill px-4" 
                    onClick={handleAskAI} 
                    disabled={loadingAI}
                >
                    {loadingAI ? <span className="spinner-border spinner-border-sm"></span> : <i className="fas fa-paper-plane"></i>}
                </button>
            </div>
            
            {aiResponse && (
                <div className="mt-3 p-3 bg-white rounded-3 shadow-sm border-start border-primary border-4 animate__animated animate__fadeIn">
                    <p className="mb-0 text-dark" style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>{aiResponse}</p>
                </div>
            )}
        </div>
    );
};
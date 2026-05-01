import { useEffect, useState } from 'react';
import axios from 'axios';

// ── FIX 2: recibe refreshKey para saber cuándo recargar la lista ──────────
export default function ChatList({ currentUser, onSelectConversation, selectedConvId, refreshKey }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (!currentUser) return;
        axios.get(`http://localhost:3001/conversations/${currentUser.id_user}`)
            .then(res => setConversations(res.data))
            .catch(err => console.error('Error cargando conversaciones:', err));
    }, [currentUser, refreshKey]); // <-- se vuelve a ejecutar cuando refreshKey cambia

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h3>Mensajes</h3>
                {currentUser?.nombre && (
                    <p>Hola, <strong>{currentUser.nombre}</strong>
                    </p>
                )}
            </div>

            <div className="chat-list-items">
                {conversations.length === 0 ? (
                    <div className="chat-list-empty">
                        <p>🐾</p>
                        <p>Aún no tienes conversaciones.</p>
                        <p>Contacta al dueño de una publicación para comenzar.</p>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id_conversation}
                            className={`chat-list-item ${conv.id_conversation === selectedConvId ? 'active' : ''}`}
                            onClick={() => onSelectConversation(conv)}
                        >
                            <div className="chat-list-avatar">
                                {conv.other_name?.charAt(0) || '?'}
                            </div>
                            <span className="chat-list-name">{conv.other_name}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

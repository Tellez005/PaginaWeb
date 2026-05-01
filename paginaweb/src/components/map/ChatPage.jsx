import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { useSocket } from '../../hooks/useSocket';
import './Chat.css';

export default function ChatPage({ currentUser }) {
    const socket = useSocket();
    const location = useLocation();
    const targetUser = location.state?.targetUser || null;

    const [selectedConversation, setSelectedConversation] = useState(null);

    // ── FIX 2: contador para forzar refresco de ChatList ──────────────────
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshList = useCallback(() => setRefreshKey(k => k + 1), []);

    const startOrOpenConversation = async (otherUser) => {
        if (!currentUser || !otherUser) return;
        try {
            const res = await axios.post('http://localhost:3001/conversations', {
                id_user1: currentUser.id_user,
                id_user2: otherUser.id_user,
            });
            setSelectedConversation({ ...res.data, other_name: otherUser.nombre });
            // ── FIX 2: refrescar la lista para que aparezca la conversación nueva ──
            refreshList();
        } catch (err) {
            console.error('Error al abrir conversación:', err);
        }
    };

    useEffect(() => {
        if (targetUser && currentUser) {
            startOrOpenConversation(targetUser);
        }
    }, [targetUser, currentUser]);

    return (
        <div className="chat-page">
            {/* Sidebar */}
            <ChatList
                currentUser={currentUser}
                onSelectConversation={setSelectedConversation}
                selectedConvId={selectedConversation?.id_conversation}
                refreshKey={refreshKey}   // FIX 2: prop que dispara el useEffect de ChatList
            />

            {/* Panel derecho */}
            <div className="chat-main">
                {selectedConversation ? (
                    <ChatWindow
                        conversation={selectedConversation}
                        currentUser={currentUser}
                        socket={socket}
                    />
                ) : (
                    <div className="chat-placeholder">
                        <div className="chat-placeholder-icon">🐾</div>
                        <p>Selecciona una conversación para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    );
}

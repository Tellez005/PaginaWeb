import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatWindow({ conversation, currentUser, socket }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!conversation) return;

        const socketInstance = socket.current;

        // Cargar historial de mensajes
        axios.get(`http://localhost:3001/messages/${conversation.id_conversation}`)
            .then(res => setMessages(res.data));

        // ── FIX 3 + FIX 4: unirse a la nueva sala ────────────────────────
        // El servidor se encarga de hacer leave de salas anteriores
        socketInstance.emit('join_conversation', conversation.id_conversation);

        // Registrar listener para mensajes entrantes
        const handleReceive = (message) => {
            setMessages(prev => [...prev, message]);
        };

        socketInstance.on('receive_message', handleReceive);

        // Cleanup: quitar este listener específico al cambiar de conversación
        return () => {
            socketInstance.off('receive_message', handleReceive);
        };
    }, [conversation, socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!inputText.trim()) return;
        socket.current.emit('send_message', {
            id_conversation: conversation.id_conversation,
            id_sender: currentUser.id_user,
            content: inputText,
        });
        setInputText('');
    };

    const otherName = conversation.other_name || 'Usuario';

    function formatTime(timestamp) {
        if (!timestamp) return '';
        const d = new Date(timestamp);
        return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <>
            {/* Header con nombre del interlocutor */}
            <div className="chat-header">
                <div className="chat-header-avatar">
                    {otherName.charAt(0)}
                </div>
                <div className="chat-header-info">
                    <span className="chat-header-name">{otherName}</span>
                    <span className="chat-header-sub">Conversación sobre mascota</span>
                </div>
            </div>

            {/* Mensajes */}
            <div className="chat-messages">
                {messages.map(msg => {
                    const isMe = msg.id_sender === currentUser.id_user;
                    const senderName = isMe
                        ? (currentUser.nombre || 'Tú')
                        : (msg.sender_name || otherName);

                    return (
                        <div
                            key={msg.id_message}
                            className={`message-group ${isMe ? 'mine' : 'theirs'}`}
                        >
                            <span className="message-sender-name">{senderName}</span>
                            <div className="message-bubble">{msg.content}</div>
                            <span className="message-time">{formatTime(msg.created_at)}</span>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <input
                    className="chat-input"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Escribe un mensaje..."
                />
                <button className="chat-send-btn" onClick={sendMessage}>
                    ➤
                </button>
            </div>
        </>
    );
}

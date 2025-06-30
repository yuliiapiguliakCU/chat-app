import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const messagesRef = collection(db, 'messages');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    try {
      await addDoc(messagesRef, {
        text: input,
        user: nickname,
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  if (!nickname) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 px-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">👋 Welcome</h1>
          <p className="mb-4 text-gray-600">Enter a nickname to join the chat</p>
          <input
            type="text"
            autoFocus
            placeholder="Your nickname"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const name = e.target.value.trim();
                if (name) setNickname(name);
              }
            }}
            className="w-1/5 px-4 py-3 rounded-lg border border-red-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          />
          <p className="text-sm text-gray-400 mt-2">Press Enter to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Chat Room</h2>
        <button
          onClick={() => setNickname('')}
          className="text-sm text-red-600 hover:underline"
        >
          Change Nickname
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-2">
        <div className="max-w-2xl mx-auto flex flex-col gap-2">
          {messages.map(msg => {
            const isOwn = msg.user === nickname;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm relative ${
                    isOwn
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-gray-200 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">
                    {isOwn ? 'You' : msg.user || 'Anonymous'}
                  </p>
                  <p className="text-base leading-snug">{msg.text || '[No message]'}</p>
                  <p className="text-[0.7rem] opacity-60 mt-1 text-right">
                    {msg.createdAt?.toDate
                      ? msg.createdAt.toDate().toLocaleTimeString()
                      : '[sending...]'}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Input bar directly after messages */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-5 py-3 rounded-full hover:bg-indigo-700 transition"
            >
              Send
            </button>
          </div>

          <div ref={messagesEndRef} />
        </div>
      </main>

    </div>
  );
}

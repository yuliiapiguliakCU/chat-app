import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const messagesRef = collection(db, 'messages');

  useEffect(() => {
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    await addDoc(messagesRef, {
      text: input,
      user: nickname,
      createdAt: new Date()
    });
    setInput('');
  }

  if (!nickname) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Welcome to Chat!
          </h1>
          <input
            type="text"
            autoFocus
            placeholder="Enter your nickname"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const name = e.target.value.trim();
                if (name) setNickname(name);
              }
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
          />
          <p className="text-center text-gray-500 mt-2 text-sm">
            Press Enter to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-md mx-auto bg-gray-100 p-4 min-h-screen">
      {/* Messages container: grows naturally, with max height + scroll */}
      <div className="max-h-[70vh] overflow-y-auto bg-white rounded-2xl p-6 shadow-lg mb-4">
        {messages.map(msg => {
          const isOwn = msg.user === nickname;
          return (
            <div
              key={msg.id}
              className={`max-w-xs break-words mb-4 p-3 rounded-xl shadow 
                ${isOwn ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white ml-auto' : 'bg-gray-200 text-gray-800'}
              `}
            >
              <p className="font-semibold text-sm mb-1">{msg.user}</p>
              <p className="mb-1">{msg.text}</p>
              <p className="text-xs opacity-60 text-right">
                {msg.createdAt?.toDate
                  ? msg.createdAt.toDate().toLocaleTimeString()
                  : new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          );
        })}
      </div>
      {/* Input area */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

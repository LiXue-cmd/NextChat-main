// app/components/ChatComponent.tsx
import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chat.store';
import { ChatLog } from '../services/chat-log.service';

export const ChatComponent = () => {
  const { logs, addLog, loading, error } = useChatStore();
  const [message, setMessage] = useState('');
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const newLog: ChatLog = {
      id: crypto.randomUUID(),
      userId: 'current-user-id', // 实际应用中应从认证状态获取
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    await addLog(newLog);
    setMessage('');
    
    // 模拟AI回复
    setTimeout(async () => {
      const aiResponse: ChatLog = {
        id: crypto.randomUUID(),
        userId: 'ai-assistant',
        content: '这是AI的回复: ' + message,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      await addLog(aiResponse);
    }, 1000);
  };
  
  return (
    <div className="chat-container">
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="chat-messages">
        {logs.map(log => (
          <div 
            key={log.id} 
            className={`message ${log.role === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">{log.content}</div>
            <div className="message-timestamp">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息..."
        />
        <button onClick={handleSendMessage}>发送</button>
      </div>
    </div>
  );
};
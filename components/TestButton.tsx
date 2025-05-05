// app/components/TestButton.tsx
"use client"

import { useState } from 'react';
import { ChatLogService } from '@/services/chat-log.service';

export const TestButton = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const chatLogService = new ChatLogService();
  
  const testApi = async () => {
    setLoading(true);
    try {
      console.log('[TestButton] 手动触发接口调用');
      const logs = await chatLogService.getChatLogs();
      setResult(JSON.stringify(logs, null, 2));
    } catch (error) {
      setResult(`错误: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded"
      onClick={testApi}
      disabled={loading}
    >
      {loading ? '测试中...' : '测试接口'}
    </button>
  );
};
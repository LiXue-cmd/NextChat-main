// app/services/chat-log.service.ts
import { ApiService } from './api.service';

export interface ChatLog {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export class ChatLogService extends ApiService {
  private baseUrl = 'http://140.143.208.64:8080/system/aiLog';
  
  async getChatLogs() {
    console.log('[ChatLogService] 开始调用 getChatLogs'); // 添加日志
    return this.fetch<{ data: ChatLog[] }>(`${this.baseUrl}/getLog`);
  }
  
  async saveChatLog(log: ChatLog) {
    console.log('[ChatLogService] 开始调用 saveChatLog'); // 添加日志
    return this.fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      body: JSON.stringify(log)
    });
  }
}
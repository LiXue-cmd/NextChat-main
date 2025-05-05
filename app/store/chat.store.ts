// app/store/chat.store.ts
import { create } from 'zustand';
import { ChatLog, ChatLogService } from '../services/chat-log.service';

interface ChatState {
  logs: ChatLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  addLog: (log: ChatLog) => Promise<void>;
}

const chatLogService = new ChatLogService();

export const useChatStore = create<ChatState>((set) => ({
  logs: [],
  loading: false,
  error: null,
  
  fetchLogs: async () => {
    console.log('[ChatStore] 开始获取聊天记录'); // 添加日志
    set({ loading: true, error: null });
    
    try {
      const logs = await chatLogService.getChatLogs();
      console.log('[ChatStore] 获取聊天记录成功:', logs); // 添加日志
      
      if (logs) {
        set({ logs });
      } else {
        set({ error: '获取聊天记录失败' });
      }
    } catch (error) {
      console.error('[ChatStore] 获取聊天记录错误:', error); // 添加日志
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  addLog: async (log) => {
    set({ loading: true, error: null });
    try {
      const savedLog = await chatLogService.saveChatLog(log);
      if (savedLog) {
        set((state) => ({ logs: [...state.logs, savedLog] }));
      } else {
        set({ error: 'Failed to save chat log' });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  }
}));
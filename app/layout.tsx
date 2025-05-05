// app/layout.tsx
"use client"

import { useEffect } from 'react';
import { useChatStore } from '@/store/chat.store';
import { AuthService } from '@/services/auth.service';

export default function RootLayout({ children }) {
  const fetchLogs = useChatStore((state) => state.fetchLogs);
  
  useEffect(() => {
    console.log('[RootLayout] 组件加载，检查认证状态'); // 添加日志
    console.log('[RootLayout] 当前 token:', AuthService.getToken()); // 打印 token
  console.log('[RootLayout] 认证状态:', AuthService.isAuthenticated()); // 打印认证状态
    if (AuthService.isAuthenticated()) {
      console.log('[RootLayout] 已认证，开始获取聊天记录'); // 添加日志
      fetchLogs();
    } else {
      console.log('[RootLayout] 未认证，跳过获取聊天记录'); // 添加日志
    }
  }, [fetchLogs]);

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
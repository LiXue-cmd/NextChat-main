// NextChat/app/api/getCacheData.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // 从数据库、文件或其他存储中获取缓存数据
        const cacheData = {
            chats: [
                { id: '1', title: '聊天会话1', messages: [] },
                { id: '2', title: '聊天会话2', messages: [] },
            ],
            settings: { theme: 'dark', language: 'zh' },
            // 其他缓存数据...
        };

        return NextResponse.json(cacheData, { status: 200 });
    } catch (error) {
        console.error('Error fetching cache data:', error);
        return NextResponse.json({ message: 'Failed to fetch cache data' }, { status: 500 });
    }
}
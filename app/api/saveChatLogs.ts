// NextChat/app/api/saveChatLogs.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const chatLogs = await req.json();
        // 这里可以添加将chatLogs保存到数据库或其他存储的逻辑
        console.log('Received chat logs:', chatLogs);
        return NextResponse.json({ message: 'Chat logs saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving chat logs:', error);
        return NextResponse.json({ message: 'Failed to save chat logs' }, { status: 500 });
    }
}
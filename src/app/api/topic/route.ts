import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 定义TopicRequest接口，用于描述请求体的结构
interface TopicRequest {
    userId: string;
    avatar: string;
    content: string;
    images: string[];
    options: string[];
}

// 创建PrismaClient实例，用于与数据库交互
const prisma = new PrismaClient();

export async function GET() {
    try {
        // 从数据库中获取所有话题数据
        const topics = await prisma.topic.findMany({
            include: {
                options: true
            }
        })
        return NextResponse.json({
            topics
        }, { status: 200 });
    } catch (e) {
        console.error("🚀 ~ file: route.ts:18 ~ GET ~ e:", e);
        return NextResponse.json({
            message: "Internal Error"
        }, { status: 500 });
    }
}

// 定义POST方法，用于处理创建新话题的请求
export async function POST(request: NextRequest) {
    try {
        // 解析请求体为TopicRequest类型
        const data = (await request.json()) as TopicRequest;

        // 使用PrismaClient创建新的话题
        const topic = await prisma.topic.create({
            data: {
                userId: data.userId,
                avatar: data.avatar,
                content: data.content,
                images: data.images,
                options: {
                    create: data.options.map((item) => ({
                        key: item,
                        value: 0,
                    })),
                },
            },
            include: {
                options: true
            }
        });

        // 返回创建的话题数据，状态码为200
        return NextResponse.json(topic, { status: 200 });
    } catch (e) {
        // 捕获异常并记录错误信息，返回内部错误信息，状态码为500
        console.error("🚀 ~ file: route.ts:16 ~ POST ~ e:", e);
        return NextResponse.json(
            {
                message: "Internal error",
            },
            { status: 500 }
        );
    }
}
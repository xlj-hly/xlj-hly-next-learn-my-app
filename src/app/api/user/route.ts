import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

interface UserRequest {
    userId: string;
}

const prisma = new PrismaClient();

// 处理用户请求的POST方法
export async function POST(request: NextRequest) {
    // 处理用户请求的POST方法
    try {
        // 从请求中解析出userId
        const { userId } = (await request.json()) as UserRequest;

        // 如果userId不存在，返回400状态码和错误信息
        if (!userId) {
            return NextResponse.json({
                message: "Bad Request"
            }, { status: 400 });
        }

        // 根据userId查询用户信息
        let user = await prisma.user.findUnique({
            where: {
                userId: userId
            }
        });

        // 如果用户不存在，则创建新用户
        if (!user) {
            user = await prisma.user.create({
                data: {
                    userId: userId
                }
            })
        }

        // 返回用户信息和200状态码
        return NextResponse.json({
            user
        }, { status: 200 });
    } catch (e) {
        // 捕获并记录错误，返回500状态码和错误信息
        console.error("🚀 ~ file: route.ts:13 ~ POST ~ e:", e);
        return NextResponse.json({
            message: "Internal Error"
        }, { status: 500 }
        );
    }
}
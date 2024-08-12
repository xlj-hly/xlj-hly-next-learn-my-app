import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
  
// 导出默认的认证中间件配置
export default authMiddleware({
  // 在认证之后的处理逻辑
  async afterAuth(auth, req, evt) {
    // 处理未认证的用户
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    
const request = await fetch(process.env.API_ADDRESS + "/user",{
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: auth.userId,
  }),
});
await request.json();
  },
});
 
// 导出配置对象，定义中间件的匹配规则
export const config = {
  matcher: [
    // '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'
    '/',
  ],
};
 
// 创建一个路由匹配器，用于判断请求是否为公共路由
// const isPublicRoute = createRouteMatcher(['/sign-in', '/sign-up']);
 
// 导出默认的 Clerk 中间件函数，用于处理认证逻辑
// export default clerkMiddleware((auth, request) => {
//   if (!isPublicRoute(request)) {
//     auth().protect();
//   }
// });
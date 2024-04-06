import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({session, token, user}) {
            let data={
                ...session,
                user:{
                    id:token.sub
                }
            }
            // session.user.id = token.sub;
            return data;
        },
        //验证请求是否有权通过
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [], // 列不同的登录选项，空满足auth配置
} satisfies NextAuthConfig;
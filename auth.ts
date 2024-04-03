import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
async function getUser(loginName: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM t_user WHERE login_name = ${loginName}`;
        return user.rows[0];
    } catch (error) {
        throw new Error('Failed to fetch user.');
    }
}


export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('credentials', credentials);
                let result = null;
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) {
                        result = null;
                        return null
                    }
                    const passwordMatch = await bcrypt.compare(password, user.login_password);
                    if (passwordMatch) {
                        console.log('password match');
                        const session = {id: user.id, name: user.login_name, email: user.email};
                        result=session;
                        return session;
                    }
                }
                return result
            }
        }),
    ]
})
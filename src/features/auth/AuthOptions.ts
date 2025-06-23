import NextAuth, { NextAuthOptions, Session } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { JWT } from 'next-auth/jwt';
import { findTeacherByEmailWithJobs, updateToken } from '../teachers/TeacherRepo';

type Token = {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    user?: any;
    error?: string;
  };
  
  type AzureTokenResponse = {
    id_token: string;
    expires_in: number;
    refresh_token?: string;
    [key: string]: any;
  };

  declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        jobs?: string | null
      };
      accessToken?: any
    }
  }
  
  const env = process.env;
  
  export async function refreshAccessToken(token: Token): Promise<Token> {
    try {
      const url = `https://login.microsoftonline.com/${env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`;
  
      const body = new URLSearchParams({
        client_id: env.AZURE_AD_CLIENT_ID || 'azure-ad-client-id',
        client_secret:
          env.AZURE_AD_CLIENT_SECRET || 'azure-ad-client-secret',
        scope: 'email openid profile User.Read offline_access',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      });
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
  
      const refreshedTokens: AzureTokenResponse = await response.json();
  
      if (!response.ok) {
        throw refreshedTokens;
      }
  
      return {
        ...token,
        accessToken: refreshedTokens.id_token,
        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      };
    } catch (error) {
      console.error('Failed to refresh token', error);
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  }

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: env.AZURE_AD_CLIENT_ID || '',
      clientSecret: env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: env.AZURE_AD_TENANT_ID || '',
      authorization: {
        params: {
          scope: 'openid email profile User.Read offline_access',
        },
      },
      httpOptions: { timeout: 10000 },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: any;
      account?: any;
    }): Promise<JWT> {
      if (account && user) {
        return {
          ...token,
          accessToken: account.id_token,
          accessTokenExpires: account?.expires_at
            ? account.expires_at * 1000
            : 0,
          refreshToken: account.refresh_token,
          user,
        }
      }

      if (Date.now() < (Number(token.accessTokenExpires) ?? 0) - 100000 || 0) {
        return token;
      }
      return await refreshAccessToken(token as Token);
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const user = await findTeacherByEmailWithJobs(token.accessToken as string ,token.email || '')
      if (session.user && user) {
        session.user = {...token.user as any, jobs: user.jobs} as any;
        (session as any).error = token.error;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account && user?.email) {
        await updateToken(account.id_token || '', user.email);
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);

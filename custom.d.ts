declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: number;
        username: string;
        password: string;
        roles: Role[];
      };
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    visits?: number;
  }
}

export {};

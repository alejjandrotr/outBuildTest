import { Request } from "express";

export interface AuthUserJWTData {
  id: number;
  email: string;
}

export type RequestWithAuth = Request & { auth?: AuthUserJWTData };

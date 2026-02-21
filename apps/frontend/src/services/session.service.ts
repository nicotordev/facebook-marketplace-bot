import { backendClient } from "./base.service";
import { authCookie } from "@/lib/cookies";

export interface Session {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  age: number | null;
}

export interface AuthResponse {
  token: string;
  user: Session;
}

class SessionService {
  async register(data: {
    username: string;
    password: string;
    name?: string;
    email?: string;
    age?: number;
  }): Promise<AuthResponse> {
    const response = await backendClient.post<AuthResponse>(
      "/api/v1/auth/register",
      data,
    );
    authCookie.setToken(response.data.token);
    return response.data;
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await backendClient.post<AuthResponse>(
      "/api/v1/auth/login",
      data,
    );
    authCookie.setToken(response.data.token);
    return response.data;
  }

  logout(): void {
    authCookie.clearToken();
  }

  async getSession(): Promise<Session> {
    const response = await backendClient.get<Session>("/api/v1/auth/me");
    return response.data;
  }
}

// Auto-initialize and export the singleton instance
const sessionService = new SessionService();
export default sessionService;

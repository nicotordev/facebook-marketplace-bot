const AUTH_TOKEN_KEY = "auth_token";
const COOKIE_MAX_AGE_DAYS = 7;

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts[1]?.split(";").shift() ?? null;
  return null;
}

function setCookie(name: string, value: string, maxAgeDays: number = COOKIE_MAX_AGE_DAYS): void {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export const authCookie = {
  getToken(): string | null {
    return getCookie(AUTH_TOKEN_KEY);
  },
  setToken(token: string): void {
    setCookie(AUTH_TOKEN_KEY, token);
  },
  clearToken(): void {
    removeCookie(AUTH_TOKEN_KEY);
  },
};

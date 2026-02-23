// 认证相关工具函数和 API 对接
// TODO: 等丰川祥子提供后端 API 后完善

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'user' | 'developer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
  error?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// 登录
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await res.json();
    
    if (result.token) {
      localStorage.setItem('ham_token', result.token);
      if (result.refreshToken) {
        localStorage.setItem('ham_refresh_token', result.refreshToken);
      }
      localStorage.setItem('ham_user', JSON.stringify(result.user));
    }
    
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: '网络错误，请稍后重试' };
  }
}

// 注册
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return await res.json();
  } catch (error) {
    console.error('Register failed:', error);
    return { success: false, error: '网络错误，请稍后重试' };
  }
}

// 登出
export function logout(): void {
  localStorage.removeItem('ham_token');
  localStorage.removeItem('ham_refresh_token');
  localStorage.removeItem('ham_user');
  window.location.href = '/login';
}

// 获取当前用户
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('ham_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// 获取 Token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ham_token');
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!getToken();
}

// 带认证的 fetch 封装
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// 刷新 Token
export async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('ham_refresh_token');
  if (!refreshToken) return false;
  
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    const result = await res.json();
    
    if (result.token) {
      localStorage.setItem('ham_token', result.token);
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

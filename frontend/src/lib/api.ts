// HAM API 调用封装
import { Agent } from '@/types';
import { mockAgents } from './mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export interface AgentListParams {
  keyword?: string;
  category?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface AgentListResponse {
  data: Agent[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取 Agent 列表
export async function getAgents(params: AgentListParams = {}): Promise<AgentListResponse> {
  // Mock 模式
  if (USE_MOCK) {
    let result = [...mockAgents];
    
    // 搜索
    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(kw) ||
        a.tagline.toLowerCase().includes(kw)
      );
    }
    
    // 分类
    if (params.category && params.category !== '全部') {
      result = result.filter(a => a.category === params.category);
    }
    
    // 排序
    if (params.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (params.sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      result.sort((a, b) => b.callCount - a.callCount);
    }
    
    return {
      data: result,
      total: result.length,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    };
  }

  // 真实 API 调用
  const query = new URLSearchParams();
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.category) query.set('category', params.category);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.page) query.set('page', params.page.toString());
  if (params.pageSize) query.set('pageSize', params.pageSize.toString());

  const res = await fetch(`${API_BASE}/agents?${query}`);
  return res.json();
}

// 获取单个 Agent
export async function getAgent(id: string): Promise<Agent | null> {
  if (USE_MOCK) {
    return mockAgents.find(a => a.id === id) || null;
  }

  const res = await fetch(`${API_BASE}/agents/${id}`);
  if (!res.ok) return null;
  return res.json();
}

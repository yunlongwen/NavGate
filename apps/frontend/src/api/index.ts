import type { Group, Site, Config, LoginCredentials, LoginResponse } from '@navgate/types'

const mode = import.meta.env.VITE_DEPLOY_MODE || 'github-pages'

// 根据环境选择正确的 API 实现
// 使用条件导入而不是 top-level await
let apiModule: any

if (mode === 'github-pages') {
  // GitHub Pages 模式：直接导入 localStorage 实现
  apiModule = import('./local')
} else {
  // 后端模式：直接导入 HTTP API 实现
  apiModule = import('./http')
}

// 包装函数以延迟加载 API 实现
async function getApi() {
  return await apiModule
}

// 导出所有 API 函数
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const api = await getApi()
  return api.login(credentials)
}

export const getGroups = async (): Promise<Group[]> => {
  const api = await getApi()
  return api.getGroups()
}

export const createGroup = async (name: string, isPublic?: boolean): Promise<Group> => {
  const api = await getApi()
  return api.createGroup(name, isPublic)
}

export const updateGroup = async (
  id: number,
  updates: Partial<Pick<Group, 'name' | 'is_public'>>
): Promise<void> => {
  const api = await getApi()
  return api.updateGroup(id, updates)
}

export const deleteGroup = async (id: number): Promise<void> => {
  const api = await getApi()
  return api.deleteGroup(id)
}

export const reorderGroups = async (
  orders: Array<{ id: number; order_num: number }>
): Promise<void> => {
  const api = await getApi()
  return api.reorderGroups(orders)
}

export const getSites = async (
  groupId?: number,
  includePrivate?: boolean
): Promise<Site[]> => {
  const api = await getApi()
  return api.getSites(groupId, includePrivate)
}

export const createSite = async (
  site: Omit<Site, 'id' | 'created_at' | 'updated_at'>
): Promise<Site> => {
  const api = await getApi()
  return api.createSite(site)
}

export const updateSite = async (
  id: number,
  updates: Partial<Omit<Site, 'id' | 'group_id' | 'created_at' | 'updated_at'>>
): Promise<void> => {
  const api = await getApi()
  return api.updateSite(id, updates)
}

export const deleteSite = async (id: number): Promise<void> => {
  const api = await getApi()
  return api.deleteSite(id)
}

export const reorderSites = async (
  orders: Array<{ id: number; order_num: number; group_id?: number }>
): Promise<void> => {
  const api = await getApi()
  return api.reorderSites(orders)
}

export const getConfig = async (): Promise<Config> => {
  const api = await getApi()
  return api.getConfig()
}

export const updateConfig = async (config: Config): Promise<void> => {
  const api = await getApi()
  return api.updateConfig(config)
}

// GitHub Pages 模式额外的导出/导入功能
export const exportData = (): string => {
  // 这些函数是同步的，需要特殊处理
  // 由于无法在同步函数中等待异步加载，我们直接从 localStorage 读取
  if (mode === 'github-pages') {
    const groups = localStorage.getItem('navgate_groups') || '[]'
    const sites = localStorage.getItem('navgate_sites') || '[]'
    const config = localStorage.getItem('navgate_config') || '{}'
    return JSON.stringify(
      {
        groups: JSON.parse(groups),
        sites: JSON.parse(sites),
        config: JSON.parse(config),
      },
      null,
      2
    )
  }
  return '{}'
}

export const importData = (jsonString: string): void => {
  if (mode === 'github-pages') {
    try {
      const data = JSON.parse(jsonString)
      if (data.groups) localStorage.setItem('navgate_groups', JSON.stringify(data.groups))
      if (data.sites) localStorage.setItem('navgate_sites', JSON.stringify(data.sites))
      if (data.config) localStorage.setItem('navgate_config', JSON.stringify(data.config))
    } catch (error) {
      console.error('Failed to import data:', error)
    }
  }
}

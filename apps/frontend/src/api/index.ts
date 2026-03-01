import type { Group, Site, Config, LoginCredentials, LoginResponse } from '@navgate/types'

const mode = import.meta.env.VITE_DEPLOY_MODE || 'github-pages'

// 根据环境选择正确的 API 实现
// 使用条件导入而不是 top-level await
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let apiModule: any

if (mode === 'gist') {
  // Gist 模式：使用 GitHub Gist 作为存储
  apiModule = import('./gist')
} else if (mode === 'github-pages') {
  // GitHub Pages 模式：使用 localStorage
  apiModule = import('./local')
} else {
  // 后端模式：使用 HTTP API
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

export const getSites = async (groupId?: number, includePrivate?: boolean): Promise<Site[]> => {
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

// 导出/导入功能（支持所有模式）
export const exportData = async (): Promise<string> => {
  const api = await apiModule

  // 如果 API 实现有 exportData 方法，使用它
  if (api.exportData) {
    return api.exportData()
  }

  // 否则，手动获取数据并导出
  const [groups, sites, config] = await Promise.all([getGroups(), getSites(), getConfig()])

  return JSON.stringify({ groups, sites, config }, null, 2)
}

export const importData = async (jsonString: string): Promise<void> => {
  const api = await apiModule

  // 如果 API 实现有 importData 方法，使用它
  if (api.importData) {
    return api.importData(jsonString)
  }

  // 否则，抛出错误（后端模式不支持直接导入）
  throw new Error('Import not supported in this mode')
}

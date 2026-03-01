import type { Group, Site, Config, LoginCredentials, LoginResponse } from '@navgate/types'

const mode = import.meta.env.VITE_DEPLOY_MODE || 'github-pages'

// 根据环境动态加载 API 实现
let apiImplementation: any

if (mode === 'github-pages') {
  // GitHub Pages 模式：使用 localStorage
  apiImplementation = await import('./api/local')
} else {
  // 后端模式：使用 HTTP API
  apiImplementation = await import('./api/http')
}

// 导出所有 API 函数
export const login: (credentials: LoginCredentials) => Promise<LoginResponse> =
  apiImplementation.login

export const getGroups: () => Promise<Group[]> = apiImplementation.getGroups

export const createGroup: (name: string, isPublic?: boolean) => Promise<Group> =
  apiImplementation.createGroup

export const updateGroup: (
  id: number,
  updates: Partial<Pick<Group, 'name' | 'is_public'>>
) => Promise<void> = apiImplementation.updateGroup

export const deleteGroup: (id: number) => Promise<void> = apiImplementation.deleteGroup

export const reorderGroups: (orders: Array<{ id: number; order_num: number }>) => Promise<void> =
  apiImplementation.reorderGroups

export const getSites: (groupId?: number, includePrivate?: boolean) => Promise<Site[]> =
  apiImplementation.getSites

export const createSite: (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => Promise<Site> =
  apiImplementation.createSite

export const updateSite: (
  id: number,
  updates: Partial<Omit<Site, 'id' | 'group_id' | 'created_at' | 'updated_at'>>
) => Promise<void> = apiImplementation.updateSite

export const deleteSite: (id: number) => Promise<void> = apiImplementation.deleteSite

export const reorderSites: (
  orders: Array<{ id: number; order_num: number; group_id?: number }>
) => Promise<void> = apiImplementation.reorderSites

export const getConfig: () => Promise<Config> = apiImplementation.getConfig

export const updateConfig: (config: Config) => Promise<void> = apiImplementation.updateConfig

// GitHub Pages 模式额外的导出/导入功能
export const exportData: () => string = apiImplementation.exportData || (() => '{}')

export const importData: (jsonString: string) => void = apiImplementation.importData || (() => {})

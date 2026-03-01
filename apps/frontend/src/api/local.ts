import type { Group, Site, Config } from '@navgate/types'
import { storage, generateId, reorderArray } from '@navgate/utils'

// 默认配置
const DEFAULT_CONFIG: Config = {
  SITE_TITLE: 'NavGate',
  SITE_DESCRIPTION: '我的个人导航站',
}

// 默认数据
const DEFAULT_DATA = {
  groups: [] as Group[],
  sites: [] as Site[],
  config: DEFAULT_CONFIG,
}

// 获取或初始化数据
function getData() {
  return {
    groups: storage.get<Group[]>('navgate_groups') || [],
    sites: storage.get<Site[]>('navgate_sites') || [],
    config: storage.get<Config>('navgate_config') || DEFAULT_CONFIG,
  }
}

// 保存数据
function saveData(data: { groups?: Group[]; sites?: Site[]; config?: Config }) {
  if (data.groups !== undefined) {
    storage.set('navgate_groups', data.groups)
  }
  if (data.sites !== undefined) {
    storage.set('navgate_sites', data.sites)
  }
  if (data.config !== undefined) {
    storage.set('navgate_config', data.config)
  }
}

// ===== 认证相关 =====

export async function login(credentials: { username: string; password: string }) {
  // GitHub Pages 模式不验证，直接返回成功
  return {
    token: 'local-storage-token',
    username: credentials.username,
  }
}

// ===== 分组相关 =====

export async function getGroups(): Promise<Group[]> {
  const { groups } = getData()
  return groups
}

export async function createGroup(name: string, isPublic = true): Promise<Group> {
  const { groups } = getData()

  const newGroup: Group = {
    id: generateId(),
    name,
    order_num: groups.length,
    is_public: isPublic ? 1 : 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  groups.push(newGroup)
  saveData({ groups })

  return newGroup
}

export async function updateGroup(
  id: number,
  updates: Partial<Pick<Group, 'name' | 'is_public'>>
): Promise<void> {
  const { groups } = getData()
  const index = groups.findIndex(g => g.id === id)

  if (index === -1) {
    throw new Error('分组不存在')
  }

  groups[index] = {
    ...groups[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  saveData({ groups })
}

export async function deleteGroup(id: number): Promise<void> {
  const { groups, sites } = getData()

  // 删除分组及其所有站点
  const newGroups = groups.filter(g => g.id !== id)
  const newSites = sites.filter(s => s.group_id !== id)

  saveData({ groups: newGroups, sites: newSites })
}

export async function reorderGroups(
  orders: Array<{ id: number; order_num: number }>
): Promise<void> {
  const { groups } = getData()
  const newGroups = reorderArray(groups, orders)
  saveData({ groups: newGroups })
}

// ===== 站点相关 =====

export async function getSites(groupId?: number): Promise<Site[]> {
  const { sites } = getData()
  if (groupId !== undefined) {
    return sites.filter(s => s.group_id === groupId)
  }
  return sites
}

export async function createSite(
  site: Omit<Site, 'id' | 'created_at' | 'updated_at'>
): Promise<Site> {
  const { sites } = getData()

  const newSite: Site = {
    ...site,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  sites.push(newSite)
  saveData({ sites })

  return newSite
}

export async function updateSite(
  id: number,
  updates: Partial<Omit<Site, 'id' | 'group_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const { sites } = getData()
  const index = sites.findIndex(s => s.id === id)

  if (index === -1) {
    throw new Error('站点不存在')
  }

  sites[index] = {
    ...sites[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  saveData({ sites })
}

export async function deleteSite(id: number): Promise<void> {
  const { sites } = getData()
  const newSites = sites.filter(s => s.id !== id)
  saveData({ sites: newSites })
}

export async function reorderSites(
  orders: Array<{ id: number; order_num: number; group_id?: number }>
): Promise<void> {
  const { sites } = getData()

  // 更新 order_num
  orders.forEach(order => {
    const site = sites.find(s => s.id === order.id)
    if (site) {
      site.order_num = order.order_num
      if (order.group_id !== undefined) {
        site.group_id = order.group_id
      }
    }
  })

  // 排序
  const newSites = sites.sort((a, b) => a.order_num - b.order_num)
  saveData({ sites: newSites })
}

// ===== 配置相关 =====

export async function getConfig(): Promise<Config> {
  const { config } = getData()
  return config
}

export async function updateConfig(config: Config): Promise<void> {
  saveData({ config })
}

// ===== 数据导出/导入 =====

export function exportData(): string {
  const data = getData()
  return JSON.stringify(data, null, 2)
}

export function importData(jsonString: string): void {
  try {
    const data = JSON.parse(jsonString)

    // 验证数据格式
    if (!data.groups || !Array.isArray(data.groups)) {
      throw new Error('无效的分组数据')
    }
    if (!data.sites || !Array.isArray(data.sites)) {
      throw new Error('无效的站点数据')
    }
    if (!data.config || typeof data.config !== 'object') {
      throw new Error('无效的配置数据')
    }

    // 保存数据
    saveData({
      groups: data.groups,
      sites: data.sites,
      config: data.config,
    })
  } catch (error) {
    throw new Error('导入数据失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

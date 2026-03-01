import type { Group, Site, Config } from '@navgate/types'

/**
 * GitHub Gist Storage API
 * 使用 GitHub Gist 作为数据存储
 *
 * 优势：
 * - 数据存储在 GitHub，可以跨设备访问
 * - 支持版本历史
 * - 免费且可靠
 * - 可以公开或私有
 *
 * 设置步骤：
 * 1. 创建 GitHub Personal Access Token (需要 gist 权限)
 * 2. 创建一个 Gist 用于存储数据
 * 3. 配置 VITE_GIST_ID 和 VITE_GITHUB_TOKEN
 */

// 从环境变量获取配置
const GIST_ID = import.meta.env.VITE_GIST_ID || ''
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

// 默认配置
const DEFAULT_CONFIG: Config = {
  SITE_TITLE: 'AI Engineer Hub',
  SITE_DESCRIPTION: 'AI应用工程师的开发导航站',
}

// 默认分组和站点数据（与 local.ts 相同）
const DEFAULT_GROUPS: Group[] = [
  {
    id: 1,
    name: 'AI 开发工具',
    order_num: 0,
    is_public: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'AI 模型平台',
    order_num: 1,
    is_public: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: '开发资源',
    order_num: 2,
    is_public: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const DEFAULT_SITES: Site[] = [
  // AI 开发工具
  {
    id: 101,
    group_id: 1,
    name: 'Cursor',
    url: 'https://cursor.sh',
    description: 'AI-powered code editor',
    icon: 'https://cursor.sh/favicon.ico',
    order_num: 0,
    is_public: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 102,
    group_id: 1,
    name: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'Your AI pair programmer',
    icon: 'https://github.githubassets.com/favicons/favicon.svg',
    order_num: 1,
    is_public: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // ... 其他站点
]

interface GistData {
  groups: Group[]
  sites: Site[]
  config: Config
}

// 缓存数据，避免频繁请求
let cachedData: GistData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5000 // 5秒缓存

/**
 * 从 Gist 获取数据
 */
async function fetchFromGist(): Promise<GistData> {
  // 如果没有配置 Gist，返回默认数据
  if (!GIST_ID) {
    console.warn('GIST_ID not configured, using default data')
    return {
      groups: DEFAULT_GROUPS,
      sites: DEFAULT_SITES,
      config: DEFAULT_CONFIG,
    }
  }

  // 使用缓存
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return cachedData
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: GITHUB_TOKEN
        ? {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          }
        : {
            Accept: 'application/vnd.github.v3+json',
          },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch gist: ${response.statusText}`)
    }

    const gist = await response.json()
    const content = gist.files['navgate-data.json']?.content

    if (!content) {
      throw new Error('navgate-data.json not found in gist')
    }

    const data = JSON.parse(content)
    cachedData = data
    lastFetchTime = now

    return data
  } catch (error) {
    console.error('Failed to fetch from Gist:', error)
    // 降级到默认数据
    return {
      groups: DEFAULT_GROUPS,
      sites: DEFAULT_SITES,
      config: DEFAULT_CONFIG,
    }
  }
}

/**
 * 保存数据到 Gist
 */
async function saveToGist(data: GistData): Promise<void> {
  if (!GIST_ID || !GITHUB_TOKEN) {
    throw new Error('GIST_ID and GITHUB_TOKEN are required for saving data')
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          'navgate-data.json': {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to save to gist: ${response.statusText}`)
    }

    // 更新缓存
    cachedData = data
    lastFetchTime = Date.now()
  } catch (error) {
    console.error('Failed to save to Gist:', error)
    throw error
  }
}

// ===== 认证相关 =====

export async function login(credentials: { username: string; password: string }) {
  // Gist 模式不需要登录
  return {
    token: 'gist-mode-token',
    username: credentials.username,
  }
}

// ===== 分组相关 =====

export async function getGroups(): Promise<Group[]> {
  const data = await fetchFromGist()
  return data.groups
}

export async function createGroup(name: string, isPublic = true): Promise<Group> {
  const data = await fetchFromGist()

  const newGroup: Group = {
    id: Date.now(),
    name,
    order_num: data.groups.length,
    is_public: isPublic ? 1 : 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  data.groups.push(newGroup)
  await saveToGist(data)

  return newGroup
}

export async function updateGroup(
  id: number,
  updates: Partial<Pick<Group, 'name' | 'is_public'>>
): Promise<void> {
  const data = await fetchFromGist()
  const index = data.groups.findIndex(g => g.id === id)

  if (index === -1) {
    throw new Error('分组不存在')
  }

  data.groups[index] = {
    ...data.groups[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  await saveToGist(data)
}

export async function deleteGroup(id: number): Promise<void> {
  const data = await fetchFromGist()

  data.groups = data.groups.filter(g => g.id !== id)
  data.sites = data.sites.filter(s => s.group_id !== id)

  await saveToGist(data)
}

export async function reorderGroups(
  orders: Array<{ id: number; order_num: number }>
): Promise<void> {
  const data = await fetchFromGist()
  const orderMap = new Map(orders.map(o => [o.id, o.order_num]))

  data.groups = data.groups
    .map(group => ({
      ...group,
      order_num: orderMap.get(group.id) ?? group.order_num,
    }))
    .sort((a, b) => a.order_num - b.order_num)

  await saveToGist(data)
}

// ===== 站点相关 =====

export async function getSites(groupId?: number): Promise<Site[]> {
  const data = await fetchFromGist()
  if (groupId !== undefined) {
    return data.sites.filter(s => s.group_id === groupId)
  }
  return data.sites
}

export async function createSite(
  site: Omit<Site, 'id' | 'created_at' | 'updated_at'>
): Promise<Site> {
  const data = await fetchFromGist()

  const newSite: Site = {
    ...site,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  data.sites.push(newSite)
  await saveToGist(data)

  return newSite
}

export async function updateSite(
  id: number,
  updates: Partial<Omit<Site, 'id' | 'group_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const data = await fetchFromGist()
  const index = data.sites.findIndex(s => s.id === id)

  if (index === -1) {
    throw new Error('站点不存在')
  }

  data.sites[index] = {
    ...data.sites[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }

  await saveToGist(data)
}

export async function deleteSite(id: number): Promise<void> {
  const data = await fetchFromGist()
  data.sites = data.sites.filter(s => s.id !== id)
  await saveToGist(data)
}

export async function reorderSites(
  orders: Array<{ id: number; order_num: number; group_id?: number }>
): Promise<void> {
  const data = await fetchFromGist()

  orders.forEach(order => {
    const site = data.sites.find(s => s.id === order.id)
    if (site) {
      site.order_num = order.order_num
      if (order.group_id !== undefined) {
        site.group_id = order.group_id
      }
    }
  })

  data.sites.sort((a, b) => a.order_num - b.order_num)
  await saveToGist(data)
}

// ===== 配置相关 =====

export async function getConfig(): Promise<Config> {
  const data = await fetchFromGist()
  return data.config
}

export async function updateConfig(config: Config): Promise<void> {
  const data = await fetchFromGist()
  data.config = config
  await saveToGist(data)
}

// ===== 数据导出/导入 =====

export async function exportData(): Promise<string> {
  const data = await fetchFromGist()
  return JSON.stringify(data, null, 2)
}

export async function importData(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString)

    if (!data.groups || !Array.isArray(data.groups)) {
      throw new Error('无效的分组数据')
    }
    if (!data.sites || !Array.isArray(data.sites)) {
      throw new Error('无效的站点数据')
    }
    if (!data.config || typeof data.config !== 'object') {
      throw new Error('无效的配置数据')
    }

    await saveToGist(data)
  } catch (error) {
    throw new Error('导入数据失败：' + (error instanceof Error ? error.message : '未知错误'))
  }
}

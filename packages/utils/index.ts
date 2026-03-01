import type { Group, Site } from '@navgate/types'

/**
 * LocalStorage 工具类
 */
export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Storage get failed for key ${key}:`, error)
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Storage set failed for key ${key}:`, error)
      throw new Error('存储空间不足，请清理一些数据后重试')
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },

  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  },

  getSize(): number {
    let size = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length
      }
    }
    return size
  },

  getSizeInMB(): number {
    return this.getSize() / (1024 * 1024)
  },
}

/**
 * 验证 URL 格式
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 提取网站图标
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
  } catch {
    return ''
  }
}

/**
 * 排序数组
 */
export function reorderArray<T extends { order_num: number }>(
  array: T[],
  orders: Array<{ id: number; order_num: number }>
): T[] {
  const orderMap = new Map(orders.map(o => [o.id, o.order_num]))

  return array
    .map(item => ({
      ...item,
      order_num: orderMap.get(item.id) ?? item.order_num,
    }))
    .sort((a, b) => a.order_num - b.order_num)
}

/**
 * 生成唯一 ID
 */
export function generateId(): number {
  return Date.now() + Math.random()
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 验证分组数据
 */
export function validateGroup(group: Partial<Group>): string | null {
  if (!group.name || group.name.trim().length === 0) {
    return '分组名称不能为空'
  }
  if (group.name.length > 50) {
    return '分组名称不能超过 50 个字符'
  }
  return null
}

/**
 * 验证站点数据
 */
export function validateSite(site: Partial<Site>): string | null {
  if (!site.name || site.name.trim().length === 0) {
    return '站点名称不能为空'
  }
  if (!site.url || site.url.trim().length === 0) {
    return '站点 URL 不能为空'
  }
  if (!isValidUrl(site.url)) {
    return '站点 URL 格式不正确'
  }
  if (site.name.length > 100) {
    return '站点名称不能超过 100 个字符'
  }
  if (site.url.length > 500) {
    return '站点 URL 不能超过 500 个字符'
  }
  if (site.description && site.description.length > 200) {
    return '站点描述不能超过 200 个字符'
  }
  if (site.notes && site.notes.length > 500) {
    return '站点备注不能超过 500 个字符'
  }
  return null
}

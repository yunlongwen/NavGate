import { Request, Response } from 'express'
import type { GroupRecord, SiteRecord, NavData } from '../storage/jsonDatabase'
import fs from 'fs/promises'
import path from 'path'

const dataFilePath = process.env.JSON_DB_PATH || '/app/data/nav-data.json'

async function loadData(): Promise<NavData> {
  const raw = await fs.readFile(dataFilePath, 'utf8')
  return JSON.parse(raw) as NavData
}

async function saveData(data: NavData): Promise<void> {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true })
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
}

export async function exportData(req: Request, res: Response) {
  try {
    const data = await loadData()
    res.json({
      groups: data.groups,
      sites: data.sites,
      config: data.config,
    })
  } catch (error) {
    res.status(500).json({ error: '导出失败：' + (error as Error).message })
  }
}

export async function importData(req: Request, res: Response) {
  try {
    const { groups, sites, config } = req.body

    // 验证数据格式
    if (!groups || !Array.isArray(groups)) {
      return res.status(400).json({ error: '无效的分组数据' })
    }
    if (!sites || !Array.isArray(sites)) {
      return res.status(400).json({ error: '无效的站点数据' })
    }
    if (!config || typeof config !== 'object') {
      return res.status(400).json({ error: '无效的配置数据' })
    }

    // 加载现有数据以获取 nextId
    const currentData = await loadData()

    // 已存在的分组名集合（按 name 去重）
    const existingGroupNames = new Set(
      currentData.groups.map(g => (g.name || '').trim().toLowerCase())
    )
    // 已存在的站点 URL 集合（按 url 去重）
    const existingSiteUrls = new Set(currentData.sites.map(s => (s.url || '').trim().toLowerCase()))

    type ImportedGroup = {
      id?: number
      name?: string
      is_public?: number
      order_num?: number
    }
    type ImportedSite = {
      id?: number
      group_id?: number
      name?: string
      url?: string
      icon?: string | null
      description?: string | null
      notes?: string | null
      is_public?: number
      order_num?: number
    }

    // 生成新的分组 ID 映射（仅对需要新增的分组分配新 ID）
    const groupIdsMap = new Map<number, number>()
    let nextGroupId = currentData.nextGroupId
    ;(groups as ImportedGroup[]).forEach(group => {
      if (!group.id) return
      const nameKey = (group.name || '').trim().toLowerCase()
      // 若同名分组已存在，复用其 ID，避免重复
      if (existingGroupNames.has(nameKey)) {
        const existing = currentData.groups.find(
          g => (g.name || '').trim().toLowerCase() === nameKey
        )
        if (existing) {
          groupIdsMap.set(group.id, existing.id)
          return
        }
      }
      groupIdsMap.set(group.id, nextGroupId)
      nextGroupId++
    })

    // 生成新的站点 ID 映射（仅对需要新增的站点分配新 ID）
    const siteIdsMap = new Map<number, number>()
    let nextSiteId = currentData.nextSiteId
    ;(sites as ImportedSite[]).forEach(site => {
      if (!site.id) return
      const urlKey = (site.url || '').trim().toLowerCase()
      if (existingSiteUrls.has(urlKey)) {
        const existing = currentData.sites.find(s => (s.url || '').trim().toLowerCase() === urlKey)
        if (existing) {
          siteIdsMap.set(site.id, existing.id)
          return
        }
      }
      siteIdsMap.set(site.id, nextSiteId)
      nextSiteId++
    })

    // 转换并去重分组数据：按 name 去重，跳过已存在的
    const seenGroupNames = new Set<string>()
    const newGroups: GroupRecord[] = []
    for (const group of groups as ImportedGroup[]) {
      const nameKey = (group.name || '').trim().toLowerCase()
      if (!nameKey) continue
      if (existingGroupNames.has(nameKey) || seenGroupNames.has(nameKey)) continue
      seenGroupNames.add(nameKey)
      newGroups.push({
        id: groupIdsMap.get(group.id!) || nextGroupId++,
        name: group.name!,
        is_public: group.is_public ?? 1,
        order_num: group.order_num ?? 0,
      })
    }

    // 转换并去重站点数据：按 url 去重，跳过已存在的
    const seenSiteUrls = new Set<string>()
    const newSites: SiteRecord[] = []
    for (const site of sites as ImportedSite[]) {
      const urlKey = (site.url || '').trim().toLowerCase()
      if (!urlKey) continue
      if (existingSiteUrls.has(urlKey) || seenSiteUrls.has(urlKey)) continue
      seenSiteUrls.add(urlKey)
      newSites.push({
        id: siteIdsMap.get(site.id!) || nextSiteId++,
        group_id: groupIdsMap.get(site.group_id!) || site.group_id || 0,
        name: site.name || '',
        url: site.url || '',
        icon: site.icon ?? null,
        description: site.description ?? null,
        notes: site.notes ?? null,
        is_public: site.is_public ?? 1,
        order_num: site.order_num ?? 0,
      })
    }

    // 保存数据
    const newData: NavData = {
      groups: [...currentData.groups, ...newGroups],
      sites: [...currentData.sites, ...newSites],
      config: {
        ...currentData.config,
        ...config,
      },
      nextGroupId,
      nextSiteId,
    }

    await saveData(newData)

    res.json({
      success: true,
      message: '导入成功',
      importedGroups: newGroups.length,
      importedSites: newSites.length,
      skippedGroups: groups.length - newGroups.length,
      skippedSites: sites.length - newSites.length,
    })
  } catch (error) {
    console.error('Import error:', error)
    res.status(500).json({ error: '导入失败：' + (error as Error).message })
  }
}

export async function clearData(req: Request, res: Response) {
  try {
    const data: NavData = {
      groups: [],
      sites: [],
      config: {},
      nextGroupId: 1,
      nextSiteId: 1,
    }
    await saveData(data)
    res.json({ success: true, message: '数据已清空' })
  } catch (error) {
    res.status(500).json({ error: '清空失败：' + (error as Error).message })
  }
}

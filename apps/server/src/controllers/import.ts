import { Request, Response } from 'express'
import {
  jsonGetGroups,
  jsonCreateGroup,
  jsonGetSites,
  jsonCreateSite,
  jsonUpdateConfig,
  type GroupRecord,
  type SiteRecord,
  type NavData,
} from '../storage/jsonDatabase'
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

    // 创建 ID 映射（旧 ID -> 新 ID）
    const groupIdsMap = new Map<number, number>()
    const siteIdsMap = new Map<number, number>()

    // 生成新的分组 ID 映射
    let nextGroupId = currentData.nextGroupId
    groups.forEach((group: any) => {
      if (group.id) {
        groupIdsMap.set(group.id, nextGroupId)
        nextGroupId++
      }
    })

    // 生成新的站点 ID 映射
    let nextSiteId = currentData.nextSiteId
    sites.forEach((site: any) => {
      if (site.id) {
        siteIdsMap.set(site.id, nextSiteId)
        nextSiteId++
      }
    })

    // 转换分组数据
    const newGroups: GroupRecord[] = groups.map((group: any) => ({
      id: groupIdsMap.get(group.id) || nextGroupId++,
      name: group.name,
      is_public: group.is_public ?? 1,
      order_num: group.order_num ?? 0,
    }))

    // 转换站点数据（使用新的 group_id 映射）
    const newSites: SiteRecord[] = sites.map((site: any) => ({
      id: siteIdsMap.get(site.id) || nextSiteId++,
      group_id: groupIdsMap.get(site.group_id) || site.group_id,
      name: site.name,
      url: site.url,
      icon: site.icon || null,
      description: site.description || null,
      notes: site.notes || null,
      is_public: site.is_public ?? 1,
      order_num: site.order_num ?? 0,
    }))

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

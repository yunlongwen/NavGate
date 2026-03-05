import { Request, Response } from 'express'
import { validateSiteData } from '@navgate/validation'
import {
  jsonCreateSite,
  jsonDeleteSite,
  jsonGetSites,
  jsonReorderSites,
  jsonUpdateSite,
} from '../storage/jsonDatabase'

// 获取站点列表
export async function getSites(req: Request, res: Response) {
  try {
    const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : undefined
    const includePrivate = req.query.includePrivate === 'true'

    const sites = await jsonGetSites({ groupId, includePrivate })

    res.json(sites)
  } catch (error) {
    console.error('Get sites error:', error)
    res.status(500).json({ error: 'Failed to fetch sites' })
  }
}

// 创建站点
export async function createSite(req: Request, res: Response) {
  try {
    const { group_id, name, url, icon, description, notes, is_public } = req.body

    // 验证数据
    const validation = validateSiteData({ name, url, icon, description, notes, is_public })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const newSite = await jsonCreateSite({
      group_id,
      name,
      url,
      icon,
      description,
      notes,
      is_public,
    })

    if (!newSite) {
      return res.status(400).json({ error: 'Group not found' })
    }

    res.status(201).json(newSite)
  } catch (error) {
    console.error('Create site error:', error)
    res.status(500).json({ error: 'Failed to create site' })
  }
}

// 更新站点
export async function updateSite(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, url, icon, description, notes, is_public } = req.body

    // 验证数据
    const validation = validateSiteData({ name, url, icon, description, notes, is_public })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const updatedSite = await jsonUpdateSite(parseInt(id), {
      name,
      url,
      icon,
      description,
      notes,
      is_public,
    })

    if (!updatedSite) {
      return res.status(404).json({ error: 'Site not found' })
    }

    res.json(updatedSite)
  } catch (error) {
    console.error('Update site error:', error)
    res.status(500).json({ error: 'Failed to update site' })
  }
}

// 删除站点
export async function deleteSite(req: Request, res: Response) {
  try {
    const { id } = req.params

    const ok = await jsonDeleteSite(parseInt(id))
    if (!ok) {
      return res.status(404).json({ error: 'Site not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Delete site error:', error)
    res.status(500).json({ error: 'Failed to delete site' })
  }
}

// 站点排序
export async function reorderSites(req: Request, res: Response) {
  try {
    const { orders } = req.body

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid orders array' })
    }

    await jsonReorderSites(orders)

    res.status(204).send()
  } catch (error) {
    console.error('Reorder sites error:', error)
    res.status(500).json({ error: 'Failed to reorder sites' })
  }
}

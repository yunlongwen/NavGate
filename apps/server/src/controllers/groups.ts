import { Request, Response } from 'express'
import { validateGroupData } from '@navgate/validation'
import {
  jsonCreateGroup,
  jsonDeleteGroup,
  jsonGetGroups,
  jsonReorderGroups,
  jsonUpdateGroup,
} from '../storage/jsonDatabase'

// 获取分组列表
export async function getGroups(req: Request, res: Response) {
  try {
    const includePrivate = req.query.includePrivate === 'true'

    const groups = await jsonGetGroups(includePrivate)

    res.json(groups)
  } catch (error) {
    console.error('Get groups error:', error)
    res.status(500).json({ error: 'Failed to fetch groups' })
  }
}

// 创建分组
export async function createGroup(req: Request, res: Response) {
  try {
    const { name, is_public } = req.body

    // 验证数据
    const validation = validateGroupData({ name, is_public })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const newGroup = await jsonCreateGroup({ name, is_public })

    res.status(201).json(newGroup)
  } catch (error) {
    console.error('Create group error:', error)
    res.status(500).json({ error: 'Failed to create group' })
  }
}

// 更新分组
export async function updateGroup(req: Request, res: Response) {
  try {
    const { id } = req.params
    const { name, is_public } = req.body

    // 验证数据
    const validation = validateGroupData({ name, is_public })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const updatedGroup = await jsonUpdateGroup(parseInt(id), { name, is_public })

    if (!updatedGroup) {
      return res.status(404).json({ error: 'Group not found' })
    }

    res.json(updatedGroup)
  } catch (error) {
    console.error('Update group error:', error)
    res.status(500).json({ error: 'Failed to update group' })
  }
}

// 删除分组
export async function deleteGroup(req: Request, res: Response) {
  try {
    const { id } = req.params

    const ok = await jsonDeleteGroup(parseInt(id))
    if (!ok) {
      return res.status(404).json({ error: 'Group not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error('Delete group error:', error)
    res.status(500).json({ error: 'Failed to delete group' })
  }
}

// 分组排序
export async function reorderGroups(req: Request, res: Response) {
  try {
    const { orders } = req.body

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid orders array' })
    }

    await jsonReorderGroups(orders)

    res.status(204).send()
  } catch (error) {
    console.error('Reorder groups error:', error)
    res.status(500).json({ error: 'Failed to reorder groups' })
  }
}

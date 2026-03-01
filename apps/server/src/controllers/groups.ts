import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { validateGroupData } from '@navgate/validation'

const prisma = new PrismaClient()

// 获取分组列表
export async function getGroups(req: Request, res: Response) {
  try {
    const includePrivate = req.query.includePrivate === 'true'

    const groups = await prisma.group.findMany({
      where: includePrivate ? undefined : { is_public: 1 },
      orderBy: { order_num: 'asc' },
    })

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

    // 获取当前最大 order_num
    const maxOrder = await prisma.group.findFirst({
      orderBy: { order_num: 'desc' },
      select: { order_num: true },
    })

    const newGroup = await prisma.group.create({
      data: {
        name,
        is_public: is_public !== undefined ? (is_public ? 1 : 0) : 1,
        order_num: (maxOrder?.order_num ?? -1) + 1,
      },
    })

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

    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(is_public !== undefined && { is_public: is_public ? 1 : 0 }),
      },
    })

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

    await prisma.group.delete({
      where: { id: parseInt(id) },
    })

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

    // 批量更新
    await prisma.$transaction(
      orders.map((order: { id: number; order_num: number }) =>
        prisma.group.update({
          where: { id: order.id },
          data: { order_num: order.order_num },
        })
      )
    )

    res.status(204).send()
  } catch (error) {
    console.error('Reorder groups error:', error)
    res.status(500).json({ error: 'Failed to reorder groups' })
  }
}

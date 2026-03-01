import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { validateSiteData } from '@navgate/validation'

const prisma = new PrismaClient()

// 获取站点列表
export async function getSites(req: Request, res: Response) {
  try {
    const groupId = req.query.groupId ? parseInt(req.query.groupId as string) : undefined
    const includePrivate = req.query.includePrivate === 'true'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (groupId) {
      where.group_id = groupId
    }
    if (!includePrivate) {
      where.is_public = 1
    }

    const sites = await prisma.site.findMany({
      where,
      orderBy: { order_num: 'asc' },
    })

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

    // 验证分组是否存在
    const groupExists = await prisma.group.findUnique({
      where: { id: group_id },
    })

    if (!groupExists) {
      return res.status(400).json({ error: 'Group not found' })
    }

    // 获取当前最大 order_num
    const maxOrder = await prisma.site.findFirst({
      where: { group_id },
      orderBy: { order_num: 'desc' },
      select: { order_num: true },
    })

    const newSite = await prisma.site.create({
      data: {
        group_id,
        name,
        url,
        icon,
        description,
        notes,
        is_public: is_public !== undefined ? (is_public ? 1 : 0) : 1,
        order_num: (maxOrder?.order_num ?? -1) + 1,
      },
    })

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

    const updatedSite = await prisma.site.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(url !== undefined && { url }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(notes !== undefined && { notes }),
        ...(is_public !== undefined && { is_public: is_public ? 1 : 0 }),
      },
    })

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

    await prisma.site.delete({
      where: { id: parseInt(id) },
    })

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

    // 批量更新
    await prisma.$transaction(
      orders.map((order: { id: number; order_num: number; group_id?: number }) =>
        prisma.site.update({
          where: { id: order.id },
          data: {
            order_num: order.order_num,
            ...(order.group_id !== undefined && { group_id: order.group_id }),
          },
        })
      )
    )

    res.status(204).send()
  } catch (error) {
    console.error('Reorder sites error:', error)
    res.status(500).json({ error: 'Failed to reorder sites' })
  }
}

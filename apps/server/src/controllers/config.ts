import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { validateConfigData } from '@navgate/validation'

const prisma = new PrismaClient()

// 获取配置
export async function getConfig(req: Request, res: Response) {
  try {
    const configs = await prisma.config.findMany()

    // 转换为键值对对象
    const configObj: Record<string, string> = {}
    configs.forEach(config => {
      configObj[config.key] = config.value
    })

    res.json(configObj)
  } catch (error) {
    console.error('Get config error:', error)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
}

// 更新配置
export async function updateConfig(req: Request, res: Response) {
  try {
    const configData = req.body

    // 验证数据
    const validation = validateConfigData(configData)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    // 批量更新或创建配置
    await prisma.$transaction(
      Object.entries(configData).map(([key, value]) =>
        prisma.config.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    )

    res.status(204).send()
  } catch (error) {
    console.error('Update config error:', error)
    res.status(500).json({ error: 'Failed to update config' })
  }
}

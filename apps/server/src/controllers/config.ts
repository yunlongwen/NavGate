import { Request, Response } from 'express'
import { validateConfigData } from '@navgate/validation'
import { jsonGetConfig, jsonUpdateConfig } from '../storage/jsonDatabase'

// 获取配置
export async function getConfig(req: Request, res: Response) {
  try {
    const config = await jsonGetConfig()
    res.json(config)
  } catch (error) {
    console.error('Get config error:', error)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
}

// 更新配置
export async function updateConfig(req: Request, res: Response) {
  try {
    const configData = req.body

    const validation = validateConfigData(configData)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    await jsonUpdateConfig(configData)

    res.status(204).send()
  } catch (error) {
    console.error('Update config error:', error)
    res.status(500).json({ error: 'Failed to update config' })
  }
}

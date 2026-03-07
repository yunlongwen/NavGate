import { Request, Response } from 'express'
import { validateConfigData } from '@navgate/validation'
import { jsonGetConfig, jsonUpdateConfig } from '../storage/jsonDatabase'

// 获取配置
export async function getConfig(req: Request, res: Response) {
  try {
    const config = await jsonGetConfig()

    // 优先使用环境变量中的备案号配置
    const envConfig: Record<string, string> = {}
    if (process.env.ICP_NUMBER) {
      envConfig.ICP_NUMBER = process.env.ICP_NUMBER
    }
    if (process.env.POLICE_NUMBER) {
      envConfig.POLICE_NUMBER = process.env.POLICE_NUMBER
    }
    if (process.env.COPYRIGHT) {
      envConfig.COPYRIGHT = process.env.COPYRIGHT
    }
    if (process.env.CUSTOM_FOOTER) {
      envConfig.CUSTOM_FOOTER = process.env.CUSTOM_FOOTER
    }

    // 合并配置，环境变量优先
    const mergedConfig = { ...config, ...envConfig }
    res.json(mergedConfig)
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

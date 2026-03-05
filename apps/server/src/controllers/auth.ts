import { Request, Response } from 'express'

// 登录
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const configuredUsername = process.env.AUTH_USERNAME || 'admin'
    const configuredPassword = process.env.AUTH_PASSWORD || ''

    // 验证用户名
    if (username !== configuredUsername) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // 验证密码（明文对比，适用于自用导航站）
    if (password !== configuredPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // 生成简单的 Base64 token，后续请求通过 Authorization 头携带
    const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

    res.json({
      token,
      username,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

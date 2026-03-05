import { Request, Response, NextFunction } from 'express'

// 扩展 Request 类型
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.substring(7) // 移除 'Bearer ' 前缀

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [username, password] = decoded.split(':')
    const configuredUsername = process.env.AUTH_USERNAME || 'admin'
    const configuredPassword = process.env.AUTH_PASSWORD || ''

    if (username !== configuredUsername || password !== configuredPassword) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = { username }
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next()
    return
  }

  const token = authHeader.substring(7)

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const [username, password] = decoded.split(':')
    const configuredUsername = process.env.AUTH_USERNAME || 'admin'
    const configuredPassword = process.env.AUTH_PASSWORD || ''

    if (username === configuredUsername && password === configuredPassword) {
      req.user = { username }
    }
  } catch {
    // 可选认证失败，不阻止请求
  }

  next()
}

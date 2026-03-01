import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 登录
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // 验证用户名
    if (username !== process.env.AUTH_USERNAME) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, process.env.AUTH_PASSWORD || '')

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // 生成 JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d',
    })

    res.json({
      token,
      username,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
}

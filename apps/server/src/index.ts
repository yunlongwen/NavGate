import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import groupsRoutes from './routes/groups'
import sitesRoutes from './routes/sites'
import configRoutes from './routes/config'
import importRoutes from './routes/import'
import { errorHandler } from './middleware/error'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/groups', groupsRoutes)
app.use('/api/sites', sitesRoutes)
app.use('/api/config', configRoutes)
app.use('/api/data', importRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use(errorHandler)

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
})

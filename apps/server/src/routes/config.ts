import express from 'express'
import * as configController from '../controllers/config'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// 公开路由
router.get('/', configController.getConfig)

// 需要认证的路由
router.put('/', authMiddleware, configController.updateConfig)

export default router

import express from 'express'
import * as importController from '../controllers/import'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// 导出全部数据（需要认证）
router.get('/export', authMiddleware, importController.exportData)

// 导入数据（需要认证）
router.post('/import', authMiddleware, importController.importData)

// 清空数据（需要认证）
router.post('/clear', authMiddleware, importController.clearData)

export default router

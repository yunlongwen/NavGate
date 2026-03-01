import express from 'express'
import * as sitesController from '../controllers/sites'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// 公开路由
router.get('/', sitesController.getSites)

// 需要认证的路由
router.post('/', authMiddleware, sitesController.createSite)
router.put('/:id', authMiddleware, sitesController.updateSite)
router.delete('/:id', authMiddleware, sitesController.deleteSite)
router.post('/reorder', authMiddleware, sitesController.reorderSites)

export default router

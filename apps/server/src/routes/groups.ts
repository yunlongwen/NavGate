import express from 'express'
import * as groupsController from '../controllers/groups'
import { authMiddleware } from '../middleware/auth'

const router = express.Router()

// 公开路由
router.get('/', groupsController.getGroups)

// 需要认证的路由
router.post('/', authMiddleware, groupsController.createGroup)
router.put('/:id', authMiddleware, groupsController.updateGroup)
router.delete('/:id', authMiddleware, groupsController.deleteGroup)
router.post('/reorder', authMiddleware, groupsController.reorderGroups)

export default router

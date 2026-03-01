import express from 'express'
import * as authController from '../controllers/auth'

const router = express.Router()

// 登录（公开路由）
router.post('/login', authController.login)

export default router

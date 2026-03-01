import { Request, Response, NextFunction } from 'express'

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', error)

  // Prisma 错误
  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: 'Database request error',
      message: error.message,
    })
  }

  if (error.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      error: 'Database connection error',
      message: 'Failed to connect to database',
    })
  }

  // JWT 错误
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: error.message,
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Token has expired',
    })
  }

  // 默认错误
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : error.message,
  })
}

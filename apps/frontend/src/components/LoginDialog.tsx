import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import { login } from '../api'

interface LoginDialogProps {
  open: boolean
  onClose: () => void
  onLogin: (token: string) => void
}

export default function LoginDialog({ open, onClose, onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login({ username, password })
      onLogin(response.token)
      setUsername('')
      setPassword('')
    } catch {
      setError('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" flexDirection="column" alignItems="center" gap={1.5} pt={1}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlined sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              管理员登录
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="用户名"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="密码"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            取消
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ px: 4 }}>
            {loading ? '登录中...' : '登录'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

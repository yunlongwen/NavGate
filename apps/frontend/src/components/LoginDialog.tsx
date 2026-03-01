import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material'
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
    } catch (err) {
      setError('登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>管理员登录</DialogTitle>
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
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

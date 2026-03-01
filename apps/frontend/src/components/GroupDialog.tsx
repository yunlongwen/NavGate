import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Group } from '@navgate/types'

interface GroupDialogProps {
  open: boolean
  group?: Group | null
  onClose: () => void
  onSave: (data: { name: string; isPublic: boolean }) => void
}

export default function GroupDialog({ open, group, onClose, onSave }: GroupDialogProps) {
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    if (group) {
      setName(group.name)
      setIsPublic(group.is_public === 1)
    } else {
      setName('')
      setIsPublic(true)
    }
  }, [group, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSave({ name: name.trim(), isPublic })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{group ? '编辑分组' : '新建分组'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="分组名称"
            type="text"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />}
            label="公开分组"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained" disabled={!name.trim()}>
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

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
  MenuItem,
} from '@mui/material'
import { Site, Group } from '@navgate/types'

interface SiteDialogProps {
  open: boolean
  site?: Site | null
  groups: Group[]
  defaultGroupId?: number
  onClose: () => void
  onSave: (data: {
    name: string
    url: string
    description?: string
    icon?: string
    groupId: number
    isPublic: boolean
  }) => void
}

export default function SiteDialog({
  open,
  site,
  groups,
  defaultGroupId,
  onClose,
  onSave,
}: SiteDialogProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [groupId, setGroupId] = useState<number>(defaultGroupId || groups[0]?.id || 0)
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    if (site) {
      setName(site.name)
      setUrl(site.url)
      setDescription(site.description || '')
      setIcon(site.icon || '')
      setGroupId(site.group_id)
      setIsPublic(site.is_public === 1)
    } else {
      setName('')
      setUrl('')
      setDescription('')
      setIcon('')
      setGroupId(defaultGroupId || groups[0]?.id || 0)
      setIsPublic(true)
    }
  }, [site, open, defaultGroupId, groups])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && url.trim() && groupId) {
      onSave({
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        icon: icon.trim(),
        groupId,
        isPublic,
      })
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{site ? '编辑站点' : '新建站点'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="站点名称"
            type="text"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="站点URL"
            type="url"
            fullWidth
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="描述"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="图标URL（可选）"
            type="url"
            fullWidth
            value={icon}
            onChange={e => setIcon(e.target.value)}
            placeholder="https://example.com/icon.png"
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="所属分组"
            fullWidth
            value={groupId}
            onChange={e => setGroupId(Number(e.target.value))}
            required
            sx={{ mb: 2 }}
          >
            {groups.map(group => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={<Switch checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />}
            label="公开站点"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained" disabled={!name.trim() || !url.trim()}>
            保存
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

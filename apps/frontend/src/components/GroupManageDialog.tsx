import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material'
import { Edit, Delete, Add, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { Group } from '@navgate/types'
import GroupDialog from './GroupDialog'
import ConfirmDialog from './ConfirmDialog'
import { createGroup, updateGroup, deleteGroup, reorderGroups } from '../api'

interface GroupManageDialogProps {
  open: boolean
  groups: Group[]
  onClose: () => void
  onDataChange: () => void
}

export default function GroupManageDialog({
  open,
  groups,
  onClose,
  onDataChange,
}: GroupManageDialogProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null)

  const sortedGroups = [...groups].sort((a, b) => a.order_num - b.order_num)

  const handleMove = async (group: Group, direction: 'up' | 'down') => {
    const index = sortedGroups.findIndex(g => g.id === group.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= sortedGroups.length) return

    const orders = sortedGroups.map((g, i) => {
      let order_num = i
      if (i === index) order_num = targetIndex
      else if (i === targetIndex) order_num = index
      return { id: g.id, order_num }
    })

    try {
      await reorderGroups(orders)
      onDataChange()
    } catch (error) {
      console.error('Failed to reorder groups:', error)
      alert('排序失败')
    }
  }

  const handleCreateGroup = async (data: { name: string; isPublic: boolean }) => {
    try {
      await createGroup(data.name, data.isPublic)
      onDataChange()
      setShowCreateDialog(false)
    } catch (error) {
      console.error('Failed to create group:', error)
      alert('创建分组失败')
    }
  }

  const handleUpdateGroup = async (data: { name: string; isPublic: boolean }) => {
    if (!editingGroup) return
    try {
      await updateGroup(editingGroup.id, {
        name: data.name,
        is_public: data.isPublic ? 1 : 0,
      })
      onDataChange()
      setEditingGroup(null)
    } catch (error) {
      console.error('Failed to update group:', error)
      alert('更新分组失败')
    }
  }

  const handleDeleteGroup = async () => {
    if (!deletingGroup) return
    try {
      await deleteGroup(deletingGroup.id)
      onDataChange()
      setDeletingGroup(null)
    } catch (error) {
      console.error('Failed to delete group:', error)
      alert('删除分组失败')
    }
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="span" fontWeight={600}>
              管理分组
            </Typography>
            <Button
              startIcon={<Add />}
              variant="contained"
              size="small"
              onClick={() => setShowCreateDialog(true)}
            >
              新建分组
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {sortedGroups.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={4} gap={2}>
              <Typography color="text.secondary">暂无分组</Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setShowCreateDialog(true)}
              >
                创建第一个分组
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {sortedGroups.map((group, index) => (
                <ListItem
                  key={group.id}
                  divider={index < sortedGroups.length - 1}
                  sx={{ px: 1 }}
                  secondaryAction={
                    <Box display="flex" gap={0.5}>
                      <Tooltip title="上移">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === 0}
                            onClick={() => handleMove(group, 'up')}
                          >
                            <ArrowUpward fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="下移">
                        <span>
                          <IconButton
                            size="small"
                            disabled={index === sortedGroups.length - 1}
                            onClick={() => handleMove(group, 'down')}
                          >
                            <ArrowDownward fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="编辑">
                        <IconButton size="small" onClick={() => setEditingGroup(group)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton size="small" onClick={() => setDeletingGroup(group)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={600}>{group.name}</Typography>
                        <Chip
                          label={group.is_public ? '公开' : '私密'}
                          size="small"
                          color={group.is_public ? 'success' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>关闭</Button>
        </DialogActions>
      </Dialog>

      <GroupDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSave={handleCreateGroup}
      />

      <GroupDialog
        open={!!editingGroup}
        group={editingGroup}
        onClose={() => setEditingGroup(null)}
        onSave={handleUpdateGroup}
      />

      <ConfirmDialog
        open={!!deletingGroup}
        title="删除分组"
        message={`确定要删除分组"${deletingGroup?.name}"吗？该分组下的所有站点也会被删除。`}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDeleteGroup}
      />
    </>
  )
}

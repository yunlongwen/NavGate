import { useState } from 'react'
import { Box, Typography, IconButton, Grid, Tooltip, Collapse } from '@mui/material'
import { Edit, Delete, Add, ChevronRight } from '@mui/icons-material'
import { Group, Site } from '@navgate/types'
import SiteCard from './SiteCard'
import GroupDialog from './GroupDialog'
import SiteDialog from './SiteDialog'
import ConfirmDialog from './ConfirmDialog'
import { updateGroup, deleteGroup, createSite } from '../api'

interface GroupSectionProps {
  group: Group
  sites: Site[]
  groups: Group[]
  darkMode: boolean
  isAdmin: boolean
  collapsed: boolean
  onToggleCollapse: () => void
  onDataChange: () => void
}

export default function GroupSection({
  group,
  sites,
  groups,
  darkMode,
  isAdmin,
  collapsed,
  onToggleCollapse,
  onDataChange,
}: GroupSectionProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [showSiteDialog, setShowSiteDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleUpdateGroup = async (data: { name: string; isPublic: boolean }) => {
    try {
      await updateGroup(group.id, {
        name: data.name,
        is_public: data.isPublic ? 1 : 0,
      })
      onDataChange()
    } catch (error) {
      console.error('Failed to update group:', error)
      alert('更新分组失败')
    }
  }

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group.id)
      onDataChange()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete group:', error)
      alert('删除分组失败')
    }
  }

  const handleCreateSite = async (data: {
    name: string
    url: string
    description?: string
    icon?: string
    groupId: number
    isPublic: boolean
  }) => {
    try {
      await createSite({
        name: data.name,
        url: data.url,
        description: data.description,
        icon: data.icon,
        group_id: data.groupId,
        is_public: data.isPublic ? 1 : 0,
        order_num: sites.length,
      })
      onDataChange()
    } catch (error) {
      console.error('Failed to create site:', error)
      alert('创建站点失败')
    }
  }

  return (
    <Box id={`group-${group.id}`} sx={{ mb: 4, scrollMarginTop: 80 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: collapsed ? 0 : 2.5,
          cursor: 'pointer',
          userSelect: 'none',
          py: 0.5,
          px: 1,
          mx: -1,
          borderRadius: 2,
          transition: 'background-color 0.15s',
          '&:hover': {
            bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          },
        }}
        onClick={onToggleCollapse}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s',
              transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
            }}
          >
            <ChevronRight sx={{ fontSize: 20 }} />
          </Box>
          <Box
            sx={{
              width: 4,
              height: 20,
              borderRadius: 2,
              background: 'linear-gradient(180deg, #6366f1, #a78bfa)',
              flexShrink: 0,
            }}
          />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.05rem' }}>
            {group.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '0.78rem',
              ml: 0.5,
            }}
          >
            {sites.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }} onClick={e => e.stopPropagation()}>
          {isAdmin && (
            <>
              <Tooltip title="添加站点">
                <IconButton size="small" onClick={() => setShowSiteDialog(true)}>
                  <Add fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="编辑分组">
                <IconButton size="small" onClick={() => setShowGroupDialog(true)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="删除分组">
                <IconButton size="small" onClick={() => setShowDeleteDialog(true)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      <Collapse in={!collapsed} timeout={250}>
        <Box sx={{ pt: 0.5 }}>
          <Grid container spacing={2}>
            {sites.map(site => (
              <Grid key={site.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SiteCard
                  site={site}
                  groups={groups}
                  darkMode={darkMode}
                  isAdmin={isAdmin}
                  onDataChange={onDataChange}
                />
              </Grid>
            ))}
          </Grid>

          {sites.length === 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60px">
              <Typography variant="body2" color="text.secondary">
                {isAdmin ? '该分组暂无站点，点击 + 添加' : '该分组暂无站点'}
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>

      {isAdmin && (
        <>
          <GroupDialog
            open={showGroupDialog}
            group={group}
            onClose={() => setShowGroupDialog(false)}
            onSave={handleUpdateGroup}
          />
          <SiteDialog
            open={showSiteDialog}
            groups={groups}
            defaultGroupId={group.id}
            onClose={() => setShowSiteDialog(false)}
            onSave={handleCreateSite}
          />
          <ConfirmDialog
            open={showDeleteDialog}
            title="删除分组"
            message={`确定要删除分组"${group.name}"吗？该分组下的所有站点也会被删除。`}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDeleteGroup}
          />
        </>
      )}
    </Box>
  )
}

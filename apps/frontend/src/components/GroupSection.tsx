import { useState } from 'react'
import { Box, Typography, Paper, IconButton, Grid } from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
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
  onDataChange: () => void
}

export default function GroupSection({
  group,
  sites,
  groups,
  darkMode,
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
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: darkMode ? 'grey.800' : 'white',
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
          <Box>
            <IconButton size="small" onClick={() => setShowSiteDialog(true)}>
              <Add />
            </IconButton>
            <IconButton size="small" onClick={() => setShowGroupDialog(true)}>
              <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => setShowDeleteDialog(true)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      <Grid container spacing={2}>
        {sites.map(site => (
          <Grid key={site.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SiteCard site={site} groups={groups} darkMode={darkMode} onDataChange={onDataChange} />
          </Grid>
        ))}
      </Grid>
      {sites.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
          <Typography variant="body2" color="text.secondary">
            该分组暂无站点，点击 + 添加站点
          </Typography>
        </Box>
      )}

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
    </Box>
  )
}

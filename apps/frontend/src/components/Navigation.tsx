import { useState } from 'react'
import { Box, Typography, Fab } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Group, Site } from '@navgate/types'
import GroupSection from './GroupSection'
import GroupDialog from './GroupDialog'
import { createGroup } from '../api'

interface NavigationProps {
  groups: Group[]
  sites: Site[]
  darkMode: boolean
  onDataChange: () => void
}

export default function Navigation({ groups, sites, darkMode, onDataChange }: NavigationProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false)

  const getSitesForGroup = (groupId: number) => {
    return sites.filter(site => site.group_id === groupId)
  }

  const handleCreateGroup = async (data: { name: string; isPublic: boolean }) => {
    try {
      await createGroup(data.name, data.isPublic)
      onDataChange()
    } catch (error) {
      console.error('Failed to create group:', error)
      alert('创建分组失败')
    }
  }

  if (groups.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="text.secondary">
          暂无导航分组
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {groups.map(group => (
        <GroupSection
          key={group.id}
          group={group}
          sites={getSitesForGroup(group.id)}
          groups={groups}
          darkMode={darkMode}
          onDataChange={onDataChange}
        />
      ))}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
        onClick={() => setShowGroupDialog(true)}
      >
        <Add />
      </Fab>
      <GroupDialog
        open={showGroupDialog}
        onClose={() => setShowGroupDialog(false)}
        onSave={handleCreateGroup}
      />
    </Box>
  )
}

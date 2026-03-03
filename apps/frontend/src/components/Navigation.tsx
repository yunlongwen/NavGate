import { useState, useEffect, useCallback } from 'react'
import { Box, Typography, Fab, Button, Tooltip } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Group, Site } from '@navgate/types'
import GroupSection from './GroupSection'
import GroupDialog from './GroupDialog'
import { createGroup } from '../api'

interface NavigationProps {
  groups: Group[]
  sites: Site[]
  darkMode: boolean
  isAdmin: boolean
  navigateToGroupId: number | null
  onNavigateComplete: () => void
  onDataChange: () => void
}

export default function Navigation({
  groups,
  sites,
  darkMode,
  isAdmin,
  navigateToGroupId,
  onNavigateComplete,
  onDataChange,
}: NavigationProps) {
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({})

  const toggleCollapse = useCallback((groupId: number) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }, [])

  useEffect(() => {
    if (navigateToGroupId === null) return

    setCollapsedGroups(prev => {
      if (prev[navigateToGroupId]) {
        return { ...prev, [navigateToGroupId]: false }
      }
      return prev
    })

    const timer = setTimeout(() => {
      document.getElementById(`group-${navigateToGroupId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      onNavigateComplete()
    }, 180)

    return () => clearTimeout(timer)
  }, [navigateToGroupId, onNavigateComplete])

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
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
        gap={2}
      >
        <Typography variant="h6" color="text.secondary">
          暂无导航分组
        </Typography>
        {isAdmin && (
          <>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowGroupDialog(true)}
            >
              创建第一个分组
            </Button>
            <GroupDialog
              open={showGroupDialog}
              onClose={() => setShowGroupDialog(false)}
              onSave={handleCreateGroup}
            />
          </>
        )}
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
          isAdmin={isAdmin}
          collapsed={!!collapsedGroups[group.id]}
          onToggleCollapse={() => toggleCollapse(group.id)}
          onDataChange={onDataChange}
        />
      ))}
      {isAdmin && (
        <>
          <Tooltip title="新建分组">
            <Fab
              color="primary"
              variant="extended"
              aria-label="新建分组"
              sx={{ position: 'fixed', bottom: 32, right: 32 }}
              onClick={() => setShowGroupDialog(true)}
            >
              <Add sx={{ mr: 1 }} />
              新建分组
            </Fab>
          </Tooltip>
          <GroupDialog
            open={showGroupDialog}
            onClose={() => setShowGroupDialog(false)}
            onSave={handleCreateGroup}
          />
        </>
      )}
    </Box>
  )
}

import { Box, Typography, Fab } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Group, Site } from '@navgate/types'
import GroupSection from './GroupSection'

interface NavigationProps {
  groups: Group[]
  sites: Site[]
  darkMode: boolean
  onDataChange: () => void
}

export default function Navigation({ groups, sites, darkMode, onDataChange }: NavigationProps) {
  const getSitesForGroup = (groupId: number) => {
    return sites.filter(site => site.group_id === groupId)
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
        onClick={() => {
          // TODO: 添加新分组对话框
          console.log('Add new group')
        }}
      >
        <Add />
      </Fab>
    </Box>
  )
}

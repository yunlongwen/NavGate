import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { Group } from '@navgate/types'

interface SidebarProps {
  open: boolean
  groups: Group[]
  siteCountByGroup: Record<number, number>
  darkMode: boolean
  onClose: () => void
  onNavigateToGroup: (groupId: number) => void
}

export default function Sidebar({
  open,
  groups,
  siteCountByGroup,
  darkMode,
  onClose,
  onNavigateToGroup,
}: SidebarProps) {
  const sortedGroups = [...groups].sort((a, b) => a.order_num - b.order_num)

  const handleGroupClick = (groupId: number) => {
    onNavigateToGroup(groupId)
    onClose()
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: darkMode ? '#0f172a' : '#ffffff',
          borderRight: 1,
          borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>N</Typography>
          </Box>
          <Typography variant="subtitle1" fontWeight={600}>
            导航目录
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />

      <List sx={{ px: 1, py: 1.5 }}>
        {sortedGroups.map(group => (
          <ListItem key={group.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleGroupClick(group.id)}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 1.5,
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: darkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                    color: 'primary.main',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  {group.name[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={group.name}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
              />
              <Chip
                label={siteCountByGroup[group.id] || 0}
                size="small"
                sx={{
                  height: 22,
                  minWidth: 22,
                  fontSize: '0.72rem',
                  bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {sortedGroups.length === 0 && (
        <Box py={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            暂无分组
          </Typography>
        </Box>
      )}
    </Drawer>
  )
}

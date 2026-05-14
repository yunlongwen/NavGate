import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  Login,
  Logout,
  Download,
  Upload,
  FormatListBulleted,
  Menu as MenuIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

interface HeaderProps {
  title: string
  description: string
  darkMode: boolean
  isAdmin: boolean
  onToggleDarkMode: () => void
  onLogin: () => void
  onLogout: () => void
  onOpenSidebar: () => void
  onOpenSearch: () => void
  onExport?: () => void
  onImport?: () => void
  onManageGroups?: () => void
}

export default function Header({
  title,
  description,
  darkMode,
  isAdmin,
  onToggleDarkMode,
  onLogin,
  onLogout,
  onOpenSidebar,
  onOpenSearch,
  onExport,
  onImport,
  onManageGroups,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClose = () => setAnchorEl(null)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: darkMode ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: 1,
        borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 0.5, minHeight: { xs: 56, sm: 64 } }}>
          <Tooltip title="导航目录">
            <IconButton
              onClick={onOpenSidebar}
              size="small"
              sx={{ color: 'text.secondary', mr: 0.5 }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>N</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0, mr: 1 }}>
            <Typography variant="h6" noWrap sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
            >
              {description}
            </Typography>
          </Box>

          {/* Search trigger - desktop: styled box, mobile: icon */}
          <Box
            onClick={onOpenSearch}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.6,
              borderRadius: 2,
              border: 1,
              borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              cursor: 'pointer',
              color: 'text.secondary',
              transition: 'border-color 0.2s, background-color 0.2s',
              '&:hover': {
                borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              },
              minWidth: 180,
              flexShrink: 0,
            }}
          >
            <SearchIcon sx={{ fontSize: 17 }} />
            <Typography sx={{ fontSize: '0.82rem', flex: 1 }}>搜索导航...</Typography>
            <Typography
              component="kbd"
              sx={{
                fontSize: '0.68rem',
                opacity: 0.5,
                bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                px: 0.8,
                py: 0.2,
                borderRadius: 0.8,
                fontFamily: 'inherit',
              }}
            >
              ⌘K
            </Typography>
          </Box>
          <Tooltip title="搜索">
            <IconButton
              onClick={onOpenSearch}
              size="small"
              sx={{ display: { xs: 'flex', sm: 'none' }, color: 'text.secondary' }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="GitHub 仓库">
            <IconButton
              component="a"
              href="https://github.com/yunlongwen/NavGate"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <svg
                viewBox="0 0 24 24"
                sx={{ width: 20, height: 20, fill: 'currentColor' }}
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? '浅色模式' : '深色模式'}>
            <IconButton onClick={onToggleDarkMode} size="small" sx={{ color: 'text.secondary' }}>
              {darkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>

          {isAdmin ? (
            <>
              <Tooltip title="管理菜单">
                <IconButton
                  onClick={e => setAnchorEl(e.currentTarget)}
                  size="small"
                  sx={{ ml: 0.5 }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: 'primary.main',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    A
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
              >
                {onManageGroups && (
                  <MenuItem
                    onClick={() => {
                      onManageGroups()
                      handleMenuClose()
                    }}
                  >
                    <ListItemIcon>
                      <FormatListBulleted fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>管理分组</ListItemText>
                  </MenuItem>
                )}
                {onExport && (
                  <MenuItem
                    onClick={() => {
                      onExport()
                      handleMenuClose()
                    }}
                  >
                    <ListItemIcon>
                      <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>导出数据</ListItemText>
                  </MenuItem>
                )}
                {onImport && (
                  <MenuItem
                    onClick={() => {
                      onImport()
                      handleMenuClose()
                    }}
                  >
                    <ListItemIcon>
                      <Upload fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>导入数据</ListItemText>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem
                  onClick={() => {
                    onLogout()
                    handleMenuClose()
                  }}
                >
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>退出登录</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="管理员登录">
              <IconButton onClick={onLogin} size="small" sx={{ color: 'text.secondary', ml: 0.5 }}>
                <Login fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

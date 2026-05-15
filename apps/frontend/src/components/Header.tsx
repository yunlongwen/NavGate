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
              sx={{ color: 'text.secondary', ml: 0.5 }}
            >
              <svg viewBox="0 0 24 24" sx={{ width: 20, height: 20 }}>
                <path
                  fill="currentColor"
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.419-1.315.762-1.612-2.664-.3-5.466-1.332-5.466-5.903 0-1.305.465-2.385 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.296c0 .319.217.694.825.572C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
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

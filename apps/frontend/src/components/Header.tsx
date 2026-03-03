import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Button,
} from '@mui/material'
import {
  Brightness4,
  Brightness7,
  MoreVert,
  Download,
  Upload,
  FormatListBulleted,
} from '@mui/icons-material'
import { useState } from 'react'

interface HeaderProps {
  title: string
  description: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onExport?: () => void
  onImport?: () => void
  onManageGroups?: () => void
}

export default function Header({
  title,
  description,
  darkMode,
  onToggleDarkMode,
  onExport,
  onImport,
  onManageGroups,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              {description}
            </Typography>
          </Box>
          <IconButton onClick={onToggleDarkMode} color="inherit" size="large">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={handleMenuOpen} color="inherit" size="large">
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {onManageGroups && (
              <MenuItem
                onClick={() => {
                  onManageGroups()
                  handleMenuClose()
                }}
              >
                <Button startIcon={<FormatListBulleted />} fullWidth>
                  管理分组
                </Button>
              </MenuItem>
            )}
            {onExport && (
              <MenuItem
                onClick={() => {
                  onExport()
                  handleMenuClose()
                }}
              >
                <Button startIcon={<Download />} fullWidth>
                  导出数据
                </Button>
              </MenuItem>
            )}
            {onImport && (
              <MenuItem
                onClick={() => {
                  onImport()
                  handleMenuClose()
                }}
              >
                <Button startIcon={<Upload />} fullWidth>
                  导入数据
                </Button>
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

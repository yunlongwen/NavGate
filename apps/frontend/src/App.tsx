import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  CircularProgress,
} from '@mui/material'
import Header from './components/Header'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import Sidebar from './components/Sidebar'
import SearchDialog from './components/SearchDialog'
import LoginDialog from './components/LoginDialog'
import ExportImportDialog from './components/ExportImportDialog'
import GroupManageDialog from './components/GroupManageDialog'
import { Group, Site, Config } from '@navgate/types'
import { getGroups, getSites, getConfig, exportData, importData } from './api'

const AUTH_TOKEN_KEY = 'navgate_auth_token'
const DARK_MODE_KEY = 'navgate_dark_mode'

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [config, setConfig] = useState<Config>({})
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(DARK_MODE_KEY)
    if (saved !== null) return JSON.parse(saved)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_TOKEN_KEY)
  )
  const [showLogin, setShowLogin] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)
  const [showGroupManage, setShowGroupManage] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [navigateGroupId, setNavigateGroupId] = useState<number | null>(null)

  const isAdmin = !!authToken

  const siteCountByGroup = useMemo(() => {
    const counts: Record<number, number> = {}
    sites.forEach(s => {
      counts[s.group_id] = (counts[s.group_id] || 0) + 1
    })
    return counts
  }, [sites])

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
          secondary: { main: '#ec4899' },
          background: {
            default: darkMode ? '#0f172a' : '#f1f5f9',
            paper: darkMode ? '#1e293b' : '#ffffff',
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h5: { fontWeight: 700, letterSpacing: '-0.01em' },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: 'none', fontWeight: 500, borderRadius: 8 },
            },
          },
          MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'none' } },
          },
          MuiDialog: {
            styleOverrides: { paper: { borderRadius: 16 } },
          },
          MuiFab: {
            styleOverrides: {
              root: {
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                '&:hover': { boxShadow: '0 6px 28px rgba(99,102,241,0.4)' },
              },
            },
          },
        },
      }),
    [darkMode]
  )

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkMode))
  }, [darkMode])

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [groupsData, sitesData, configData] = await Promise.all([
        getGroups(isAdmin),
        getSites(undefined, isAdmin),
        getConfig(),
      ])
      setGroups(groupsData)
      setSites(sitesData)
      setConfig(configData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (token: string) => {
    setAuthToken(token)
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setAuthToken(null)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  const handleExport = async () => {
    try {
      const jsonData = await exportData()
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `navgate-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('导出数据失败')
    }
  }

  const handleImport = async (jsonData: string) => {
    try {
      await importData(jsonData)
      await loadData()
    } catch (error) {
      console.error('Failed to import data:', error)
      alert('导入数据失败')
    }
  }

  const handleNavigateComplete = useCallback(() => {
    setNavigateGroupId(null)
  }, [])

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ bgcolor: 'background.default' }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Header
          title={config.SITE_TITLE || 'NavGate'}
          description={config.SITE_DESCRIPTION || '我的个人导航站'}
          darkMode={darkMode}
          isAdmin={isAdmin}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLogin={() => setShowLogin(true)}
          onLogout={handleLogout}
          onOpenSidebar={() => setShowSidebar(true)}
          onOpenSearch={() => setShowSearch(true)}
          onExport={handleExport}
          onImport={() => setShowExportImport(true)}
          onManageGroups={() => setShowGroupManage(true)}
        />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Navigation
            groups={groups}
            sites={sites}
            darkMode={darkMode}
            isAdmin={isAdmin}
            navigateToGroupId={navigateGroupId}
            onNavigateComplete={handleNavigateComplete}
            onDataChange={loadData}
          />
        </Container>

        <Footer config={config} darkMode={darkMode} />

        <Sidebar
          open={showSidebar}
          groups={groups}
          siteCountByGroup={siteCountByGroup}
          darkMode={darkMode}
          onClose={() => setShowSidebar(false)}
          onNavigateToGroup={id => {
            setNavigateGroupId(id)
            setShowSidebar(false)
          }}
        />

        <SearchDialog
          open={showSearch}
          sites={sites}
          groups={groups}
          darkMode={darkMode}
          onClose={() => setShowSearch(false)}
        />

        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />

        {isAdmin && (
          <>
            <GroupManageDialog
              open={showGroupManage}
              groups={groups}
              onClose={() => setShowGroupManage(false)}
              onDataChange={loadData}
            />
            <ExportImportDialog
              open={showExportImport}
              onClose={() => setShowExportImport(false)}
              onExport={handleExport}
              onImport={handleImport}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App

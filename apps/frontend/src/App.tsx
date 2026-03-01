import { useState, useEffect } from 'react'
import { Container, Box, CircularProgress } from '@mui/material'
import Header from './components/Header'
import Navigation from './components/Navigation'
import ExportImportDialog from './components/ExportImportDialog'
import { Group, Site, Config } from '@navgate/types'
import { getGroups, getSites, getConfig, exportData, importData } from './api'

function App() {
  const [groups, setGroups] = useState<Group[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [config, setConfig] = useState<Config>({})
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [groupsData, sitesData, configData] = await Promise.all([
        getGroups(),
        getSites(),
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleExport = () => {
    const jsonData = exportData()
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `navgate-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (jsonData: string) => {
    importData(jsonData)
    loadData()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'grey.900' : 'grey.50' }}>
      <Header
        title={config.SITE_TITLE || 'NavGate'}
        description={config.SITE_DESCRIPTION || '我的个人导航站'}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onExport={handleExport}
        onImport={() => setShowExportImport(true)}
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Navigation groups={groups} sites={sites} darkMode={darkMode} onDataChange={loadData} />
      </Container>
      <ExportImportDialog
        open={showExportImport}
        onClose={() => setShowExportImport(false)}
        onExport={handleExport}
        onImport={handleImport}
      />
    </Box>
  )
}

export default App

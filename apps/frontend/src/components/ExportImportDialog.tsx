import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material'
import { useState, useRef } from 'react'

interface ExportImportDialogProps {
  open: boolean
  onClose: () => void
  onExport: () => void
  onImport: (data: string) => void
}

export default function ExportImportDialog({
  open,
  onClose,
  onExport,
  onImport,
}: ExportImportDialogProps) {
  const [importData, setImportData] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      onExport()
      onClose()
    } catch (error) {
      setError('导出失败：' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target?.result as string
      setImportData(content)
      setError('')
    }
    reader.onerror = () => {
      setError('读取文件失败')
    }
    reader.readAsText(file)
  }

  const handleImportText = () => {
    try {
      if (!importData.trim()) {
        setError('请输入或选择要导入的数据')
        return
      }
      onImport(importData)
      setImportData('')
      setError('')
      onClose()
    } catch (error) {
      setError('导入失败：' + (error instanceof Error ? error.message : '未知错误'))
    }
  }

  const handleClear = () => {
    setImportData('')
    setError('')
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>数据导出/导入</DialogTitle>
      <DialogContent>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            导出数据
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            将当前所有分组、站点和配置导出为 JSON 文件，可用于备份或迁移。
          </Typography>
          <Button variant="contained" onClick={handleExport} fullWidth>
            导出数据
          </Button>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            导入数据
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            从 JSON 文件或文本框导入数据。注意：导入将覆盖现有数据，请谨慎操作。
          </Typography>

          <Box mb={2}>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button variant="outlined" onClick={() => fileInputRef.current?.click()} fullWidth>
              选择文件导入
            </Button>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            或直接粘贴 JSON 数据：
          </Typography>
          <textarea
            value={importData}
            onChange={e => setImportData(e.target.value)}
            placeholder='{"groups": [], "sites": [], "config": {}}'
            rows={10}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              resize: 'vertical',
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>清空</Button>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={handleImportText}>
          导入
        </Button>
      </DialogActions>
    </Dialog>
  )
}

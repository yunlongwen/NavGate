import { useState, useMemo, useEffect, useRef } from 'react'
import { Dialog, Box, TextField, Typography, Avatar, InputAdornment, Chip } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { Site, Group } from '@navgate/types'

interface SearchDialogProps {
  open: boolean
  sites: Site[]
  groups: Group[]
  darkMode: boolean
  onClose: () => void
}

export default function SearchDialog({
  open,
  sites,
  groups,
  darkMode,
  onClose,
}: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const resultsRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return sites.filter(
      site =>
        site.name.toLowerCase().includes(q) ||
        site.url.toLowerCase().includes(q) ||
        (site.description && site.description.toLowerCase().includes(q))
    )
  }, [query, sites])

  const groupNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    groups.forEach(g => {
      map[g.id] = g.name
    })
    return map
  }, [groups])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.querySelector('[data-selected="true"]')
      selected?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const openSite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      openSite(results[selectedIndex].url)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-container': { alignItems: 'flex-start', pt: '12vh' },
        '& .MuiDialog-paper': { borderRadius: 3, m: 2, maxHeight: '65vh' },
        '& .MuiBackdrop-root': { backdropFilter: 'blur(4px)' },
      }}
    >
      <Box>
        <TextField
          fullWidth
          autoFocus
          placeholder="搜索站点名称、URL 或描述..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { fontSize: '1.05rem', py: 1, px: 2 },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              '& fieldset': { border: 'none' },
            },
          }}
        />

        <Box
          sx={{
            borderTop: 1,
            borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          }}
        >
          {query.trim() ? (
            results.length === 0 ? (
              <Box py={4} textAlign="center">
                <Typography color="text.secondary" variant="body2">
                  未找到匹配的站点
                </Typography>
              </Box>
            ) : (
              <Box ref={resultsRef} sx={{ maxHeight: '48vh', overflow: 'auto', py: 0.5 }}>
                {results.map((site, index) => (
                  <Box
                    key={site.id}
                    data-selected={index === selectedIndex}
                    onClick={() => openSite(site.url)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      cursor: 'pointer',
                      bgcolor:
                        index === selectedIndex
                          ? darkMode
                            ? 'rgba(99,102,241,0.15)'
                            : 'rgba(99,102,241,0.07)'
                          : 'transparent',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.07)',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      transition: 'background-color 0.1s',
                    }}
                  >
                    <Avatar
                      src={
                        site.icon || `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`
                      }
                      variant="rounded"
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                      }}
                    >
                      {site.name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="body1"
                          noWrap
                          sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                        >
                          {site.name}
                        </Typography>
                        <Chip
                          label={groupNameMap[site.group_id] || ''}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.68rem', flexShrink: 0 }}
                        />
                      </Box>
                      {site.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ fontSize: '0.78rem' }}
                        >
                          {site.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          ) : (
            <Box py={3} textAlign="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
                输入关键词搜索 · 方向键选择 · Enter 打开
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  )
}

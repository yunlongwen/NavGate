import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import { Site, Group } from '@navgate/types'
import SiteDialog from './SiteDialog'
import ConfirmDialog from './ConfirmDialog'
import { updateSite, deleteSite } from '../api'

interface SiteCardProps {
  site: Site
  groups: Group[]
  darkMode: boolean
  isAdmin: boolean
  onDataChange: () => void
}

export default function SiteCard({ site, groups, darkMode, isAdmin, onDataChange }: SiteCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleOpenSite = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer')
  }

  const handleUpdateSite = async (data: {
    name: string
    url: string
    description?: string
    icon?: string
    groupId: number
    isPublic: boolean
  }) => {
    try {
      await updateSite(site.id, {
        name: data.name,
        url: data.url,
        description: data.description,
        icon: data.icon,
        is_public: data.isPublic ? 1 : 0,
      })
      onDataChange()
    } catch (error) {
      console.error('Failed to update site:', error)
      alert('更新站点失败')
    }
  }

  const handleDeleteSite = async () => {
    try {
      await deleteSite(site.id)
      onDataChange()
      setShowDeleteDialog(false)
    } catch (error) {
      console.error('Failed to delete site:', error)
      alert('删除站点失败')
    }
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          bgcolor: darkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'primary.light',
            boxShadow: darkMode
              ? '0 8px 32px rgba(99,102,241,0.12)'
              : '0 8px 32px rgba(99,102,241,0.08)',
          },
          ...(isAdmin && {
            '& .card-actions': {
              opacity: { xs: 1, md: 0 },
              transition: 'opacity 0.2s ease',
            },
            '&:hover .card-actions': { opacity: 1 },
          }),
        }}
        onClick={handleOpenSite}
      >
        <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: isAdmin ? 1 : 2 } }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={site.description ? 1 : 0}>
            <Avatar
              src={site.icon || `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`}
              alt={site.name}
              variant="rounded"
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              {site.name[0]}
            </Avatar>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 600,
                fontSize: '0.95rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}
            >
              {site.name}
            </Typography>
          </Box>
          {site.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '0.8rem',
                lineHeight: 1.5,
                pl: '48px',
              }}
            >
              {site.description}
            </Typography>
          )}
        </CardContent>
        {isAdmin && (
          <CardActions
            className="card-actions"
            sx={{ justifyContent: 'flex-end', pt: 0, pb: 0.5, px: 1 }}
          >
            <Tooltip title="编辑">
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation()
                  setShowEditDialog(true)
                }}
              >
                <Edit sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="删除">
              <IconButton
                size="small"
                onClick={e => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
      </Card>

      {isAdmin && (
        <>
          <SiteDialog
            open={showEditDialog}
            site={site}
            groups={groups}
            onClose={() => setShowEditDialog(false)}
            onSave={handleUpdateSite}
          />
          <ConfirmDialog
            open={showDeleteDialog}
            title="删除站点"
            message={`确定要删除站点"${site.name}"吗？`}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDeleteSite}
          />
        </>
      )}
    </>
  )
}

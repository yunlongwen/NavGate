import { useState } from 'react'
import { Card, CardContent, CardActions, Typography, IconButton, Box, Avatar } from '@mui/material'
import { Edit, Delete, OpenInNew } from '@mui/icons-material'
import { Site, Group } from '@navgate/types'
import SiteDialog from './SiteDialog'
import ConfirmDialog from './ConfirmDialog'
import { updateSite, deleteSite } from '../api'

interface SiteCardProps {
  site: Site
  groups: Group[]
  darkMode: boolean
  onDataChange: () => void
}

export default function SiteCard({ site, groups, darkMode, onDataChange }: SiteCardProps) {
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
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: darkMode ? 'grey.800' : 'white',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          cursor: 'pointer',
        }}
        onClick={handleOpenSite}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <Avatar
              src={site.icon || `https://www.google.com/s2/favicons?domain=${site.url}&sz=64`}
              alt={site.name}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            >
              {site.name[0]}
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {site.name}
              </Typography>
            </Box>
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
              }}
            >
              {site.description}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation()
              setShowEditDialog(true)
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleOpenSite}>
            <OpenInNew fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>

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
  )
}

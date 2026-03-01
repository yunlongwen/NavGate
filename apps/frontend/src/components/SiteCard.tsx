import { Card, CardContent, CardActions, Typography, IconButton, Box, Avatar } from '@mui/material'
import { Edit, Delete, OpenInNew } from '@mui/icons-material'
import { Site } from '@navgate/types'

interface SiteCardProps {
  site: Site
  darkMode: boolean
  onDataChange: () => void
}

export default function SiteCard({ site, darkMode, onDataChange }: SiteCardProps) {
  const handleOpenSite = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer')
  }

  return (
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
            // TODO: 编辑站点对话框
            console.log('Edit site', site.id)
          }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={e => {
            e.stopPropagation()
            // TODO: 删除确认对话框
            console.log('Delete site', site.id)
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleOpenSite}>
          <OpenInNew fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  )
}

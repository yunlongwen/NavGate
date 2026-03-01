import { Box, Typography, Paper, IconButton, Grid2 as Grid } from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { Group, Site } from '@navgate/types'
import SiteCard from './SiteCard'

interface GroupSectionProps {
  group: Group
  sites: Site[]
  darkMode: boolean
  onDataChange: () => void
}

export default function GroupSection({ group, sites, darkMode, onDataChange }: GroupSectionProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          bgcolor: darkMode ? 'grey.800' : 'white',
          borderRadius: 2,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {group.name}
          </Typography>
          <Box>
            <IconButton
              size="small"
              onClick={() => {
                // TODO: 添加站点对话框
                console.log('Add site to group', group.id)
              }}
            >
              <Add />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                // TODO: 编辑分组对话框
                console.log('Edit group', group.id)
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                // TODO: 删除确认对话框
                console.log('Delete group', group.id)
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      <Grid container spacing={2}>
        {sites.map(site => (
          <Grid key={site.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SiteCard site={site} darkMode={darkMode} onDataChange={onDataChange} />
          </Grid>
        ))}
      </Grid>
      {sites.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
          <Typography variant="body2" color="text.secondary">
            该分组暂无站点
          </Typography>
        </Box>
      )}
    </Box>
  )
}

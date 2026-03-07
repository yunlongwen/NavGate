import { Box, Typography, Link, Container } from '@mui/material'
import { Config } from '@navgate/types'

interface FooterProps {
  config: Config
  darkMode: boolean
}

export default function Footer({ config, darkMode }: FooterProps) {
  const icpNumber = config.ICP_NUMBER || ''
  const policeNumber = config.POLICE_NUMBER || ''
  const copyright = config.COPYRIGHT || ''
  const customFooter = config.CUSTOM_FOOTER || ''

  const hasContent = icpNumber || policeNumber || copyright || customFooter

  if (!hasContent) {
    return null
  }

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        borderTop: 1,
        borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        bgcolor: darkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 1, sm: 2 },
            flexWrap: 'wrap',
          }}
        >
          {copyright && (
            <Typography variant="body2" color="text.secondary">
              {copyright}
            </Typography>
          )}
          {icpNumber && (
            <Link
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {icpNumber}
            </Link>
          )}
          {policeNumber && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <img
                src="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"
                alt="公安备案"
                style={{
                  width: 20,
                  height: 20,
                  verticalAlign: 'middle',
                }}
              />
              <Link
                href={`https://beian.mps.gov.cn/#/query/webSearch?code=${policeNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {policeNumber}
              </Link>
            </Box>
          )}
          {customFooter && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
              }}
              dangerouslySetInnerHTML={{ __html: customFooter }}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}

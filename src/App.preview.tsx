import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Stack, Typography, Box } from '@mui/material';
import theme from './theme';
import UrlShortener from './components/UrlShortener';

function AppPreview() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={4}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
                URL Shortener Application
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Preview of the URL shortener with improved error handling
              </Typography>
            </Box>
            
            <UrlShortener />
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default AppPreview;
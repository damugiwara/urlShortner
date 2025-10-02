import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, CircularProgress } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function RedirectHandler() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const redirect = async () => {
      if (!shortCode) {
        setError('Invalid URL');
        setIsLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE_URL}/${shortCode}`, {
          redirect: 'manual',
        });

        if (response.type === 'opaqueredirect' || response.status === 301 || response.status === 302) {
          // Browser will handle the redirect
          return;
        }

        if (response.status === 404) {
          setError('URL not found');
        } else if (response.status === 410) {
          setError('URL has expired');
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to redirect');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    redirect();
  }, [shortCode]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              Redirecting...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will be redirected to the original URL shortly.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <ErrorOutlineIcon
              sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
            />
            <Typography variant="h4" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              The short URL you're looking for doesn't exist, has expired, or has been deleted.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
            >
              Go to Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return null;
}

export default RedirectHandler;
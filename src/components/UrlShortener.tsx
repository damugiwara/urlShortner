import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useShortenUrlMutation } from '../services/api';
import UrlList from './UrlList';

function UrlShortener() {
  const [inputUrl, setInputUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [useCustomCode, setUseCustomCode] = useState(false);
  const [expiresIn, setExpiresIn] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastShortened, setLastShortened] = useState('');
  
  const [shortenUrl, { isLoading }] = useShortenUrlMutation();

  const handleShorten = async () => {
    setError('');
    
    if (!inputUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      const result = await shortenUrl({
        originalUrl: inputUrl,
        customCode: useCustomCode && customCode ? customCode : undefined,
        expiresIn: expiresIn ? parseInt(expiresIn) : undefined,
      }).unwrap();
      
      setLastShortened(result.shortUrl);
      setShowSuccess(true);
      setInputUrl('');
      setCustomCode('');
      setExpiresIn('');
      
    } catch (err: any) {
      setError(err.data?.error || 'Failed to shorten URL. Please try again.');
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleShorten();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <LinkIcon sx={{ fontSize: 64, color: 'white', mb: 2 }} />
            <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
              URL Shortener
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Shorten your long URLs with custom domains and database storage
            </Typography>
          </Box>

          <Paper sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Enter your long URL"
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                error={!!error}
                helperText={error}
                variant="outlined"
              />
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Options</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useCustomCode}
                          onChange={(e) => setUseCustomCode(e.target.checked)}
                        />
                      }
                      label="Use custom short code"
                    />
                    
                    {useCustomCode && (
                      <TextField
                        fullWidth
                        label="Custom short code"
                        placeholder="my-custom-link"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        helperText="3-20 characters: letters, numbers, hyphens, underscores"
                      />
                    )}
                    
                    <TextField
                      fullWidth
                      type="number"
                      label="Expires in (days)"
                      placeholder="Leave empty for no expiration"
                      value={expiresIn}
                      onChange={(e) => setExpiresIn(e.target.value)}
                      helperText="Optional: Set expiration time in days"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleShorten}
                disabled={isLoading}
                sx={{ py: 1.5 }}
              >
                {isLoading ? 'Shortening...' : 'Shorten URL'}
              </Button>

              {lastShortened && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'primary.50',
                    border: '2px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Your shortened URL:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                          wordBreak: 'break-all',
                        }}
                      >
                        {lastShortened}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => handleCopy(lastShortened)}
                      sx={{ flexShrink: 0 }}
                    >
                      Copy
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          </Paper>

          <UrlList />
        </Stack>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setShowSuccess(false)}>
            URL shortened successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default UrlShortener;
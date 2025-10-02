import { useState } from 'react';
import {
  Paper,
  Typography,
  Stack,
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useGetUrlsQuery, useDeleteUrlMutation } from '../services/api';

function UrlList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetUrlsQuery({ page, limit: 10 });
  const [deleteUrl] = useDeleteUrlMutation();

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

  const handleDelete = async (shortCode: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        await deleteUrl(shortCode).unwrap();
      } catch (err) {
        console.error('Failed to delete URL:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">
          Failed to load URLs. Please check if the server is running.
        </Alert>
      </Paper>
    );
  }

  if (!data || data.urls.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No URLs yet. Create your first shortened URL above!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Your Shortened URLs
      </Typography>
      
      <Stack spacing={2}>
        {data.urls.map((mapping) => {
          const shortUrl = mapping.customDomain 
            ? `https://${mapping.customDomain}/${mapping.shortCode}`
            : `${window.location.origin}/${mapping.shortCode}`;
          
          return (
            <Paper
              key={mapping.shortCode}
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      Short URL:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: 'primary.main',
                        wordBreak: 'break-all',
                      }}
                    >
                      {shortUrl}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(shortUrl)}
                      title="Copy short URL"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => window.open(shortUrl, '_blank')}
                      title="Open in new tab"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(mapping.shortCode)}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Original URL:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-all',
                      color: 'text.primary',
                    }}
                  >
                    {mapping.originalUrl}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={`${mapping.clicks} clicks`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={new Date(mapping.createdAt).toLocaleDateString()}
                    size="small"
                    variant="outlined"
                  />
                  {mapping.expiresAt && (
                    <Chip
                      label={`Expires: ${new Date(mapping.expiresAt).toLocaleDateString()}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {data.pagination.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={data.pagination.pages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
}

export default UrlList;
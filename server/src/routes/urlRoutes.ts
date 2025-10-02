import express, { type Request, type Response } from 'express';
import { Url } from '../models/Url';
import { generateUniqueShortCode, isValidUrl, isValidCustomCode } from '../utils/shortCodeGenerator';

const router = express.Router();

// Create shortened URL
router.post('/shorten', async (req: Request, res: Response) => {
  try {
    const { originalUrl, customCode, customDomain, expiresIn } = req.body;
    
    // Validate original URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ 
        error: 'Invalid URL. Must start with http:// or https://' 
      });
    }
    
    let shortCode: string;
    
    // Handle custom code
    if (customCode) {
      if (!isValidCustomCode(customCode)) {
        return res.status(400).json({ 
          error: 'Invalid custom code. Use 3-20 alphanumeric characters, hyphens, or underscores.' 
        });
      }
      
      // Check if custom code already exists
      const existing = await Url.findOne({ shortCode: customCode });
      if (existing) {
        return res.status(409).json({ 
          error: 'Custom code already in use. Please choose another.' 
        });
      }
      
      shortCode = customCode;
    } else {
      // Generate unique short code
      shortCode = await generateUniqueShortCode();
    }
    
    // Calculate expiration date if provided
    let expiresAt: Date | undefined;
    if (expiresIn && typeof expiresIn === 'number' && expiresIn > 0) {
      expiresAt = new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000); // days to milliseconds
    }
    
    // Create URL document
    const url = new Url({
      shortCode,
      originalUrl,
      customDomain: customDomain || process.env.CUSTOM_DOMAIN,
      expiresAt,
    });
    
    await url.save();
    
    // Build short URL
    const domain = customDomain || process.env.CUSTOM_DOMAIN || req.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const shortUrl = `${protocol}://${domain}/${shortCode}`;
    
    res.status(201).json({
      shortCode,
      shortUrl,
      originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
    });
    
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all URLs (with pagination)
router.get('/urls', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Url.countDocuments();
    
    res.json({
      urls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get URL by short code
router.get('/urls/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortCode }).select('-__v');
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json(url);
    
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete URL
router.delete('/urls/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOneAndDelete({ shortCode });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json({ message: 'URL deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect endpoint
router.get('/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Check if expired
    if (url.expiresAt && url.expiresAt < new Date()) {
      await Url.findByIdAndDelete(url._id);
      return res.status(410).json({ error: 'URL has expired' });
    }
    
    // Update click count and last clicked time
    url.clicks += 1;
    url.lastClickedAt = new Date();
    await url.save();
    
    // Redirect to original URL
    res.redirect(301, url.originalUrl);
    
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics for a URL
router.get('/analytics/:shortCode', async (req: Request, res: Response) => {
  try {
    const { shortCode } = req.params;
    
    const url = await Url.findOne({ shortCode }).select('-__v');
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      lastClickedAt: url.lastClickedAt,
      expiresAt: url.expiresAt,
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
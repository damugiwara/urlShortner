import { nanoid } from 'nanoid';
import { Url } from '../models/Url';

export const generateUniqueShortCode = async (length: number = 6): Promise<string> => {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortCode = nanoid(length);
    
    // Check if code already exists
    const existing = await Url.findOne({ shortCode });
    
    if (!existing) {
      return shortCode;
    }
    
    attempts++;
  }
  
  // If all attempts failed, try with longer code
  return nanoid(length + 2);
};

export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidCustomCode = (code: string): boolean => {
  // Allow alphanumeric, hyphens, and underscores
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(code) && code.length >= 3 && code.length <= 20;
};
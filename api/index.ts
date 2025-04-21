import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { storage } from '../../server/storage';

// Create an Express instance
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the Express API as a serverless function
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Forward the request to the Express app
  return app(req, res);
}

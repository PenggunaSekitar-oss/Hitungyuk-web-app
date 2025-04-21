// api/index.js
import { createServer } from 'http';
import { createRequire } from 'module';

// Setup require for ESM
const require = createRequire(import.meta.url);

// Import the built server app
import '../dist/index.js';

// Export a dummy handler for Vercel
export default function handler(req, res) {
  // This function won't actually be called by Vercel
  // since we're using the http server from the imported file
  res.status(200).send('API is running');
}

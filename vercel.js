// vercel.js
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// This script modifies the build output to work with Vercel's serverless functions
const serverDistPath = path.resolve(process.cwd(), 'dist');
const apiDistPath = path.resolve(process.cwd(), 'api');

// Ensure the api directory exists
if (!fs.existsSync(apiDistPath)) {
  fs.mkdirSync(apiDistPath, { recursive: true });
}

// Copy necessary files to the api directory
console.log('Setting up Vercel deployment...');

// Create a package.json for the api directory if it doesn't exist
const apiPackageJson = {
  "type": "module",
  "dependencies": {
    "express": "^4.21.2",
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.39.1"
  }
};

fs.writeFileSync(
  path.join(apiDistPath, 'package.json'),
  JSON.stringify(apiPackageJson, null, 2)
);

console.log('Vercel deployment setup complete!');

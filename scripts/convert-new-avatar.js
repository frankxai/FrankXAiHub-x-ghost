import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertSvgToPng(svgPath, pngPath, width = 512, height = 512) {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert SVG to PNG with specified dimensions
    await sharp(svgBuffer)
      .resize(width, height)
      .toFile(pngPath);
    
    console.log(`Converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

// Convert the new avatar
const inputPath = path.join(__dirname, '../public/frankx-avatar-new.svg');
const outputPath = path.join(__dirname, '../public/frankx-avatar-new.png');

convertSvgToPng(inputPath, outputPath)
  .then(() => console.log('Conversion complete!'))
  .catch(err => console.error('Failed to convert:', err));
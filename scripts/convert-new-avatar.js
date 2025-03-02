import fs from 'fs';
import sharp from 'sharp';
import { promisify } from 'util';
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function convertSvgToPng(svgPath, pngPath, width = 512, height = 512) {
  try {
    // Read the SVG file
    const svgBuffer = await readFileAsync(svgPath);
    
    // Convert to PNG using sharp
    const pngBuffer = await sharp(svgBuffer)
      .resize(width, height)
      .png()
      .toBuffer();
    
    // Write the PNG file
    await writeFileAsync(pngPath, pngBuffer);
    
    console.log(`Successfully converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath} to PNG:`, error);
  }
}

// Convert the SVG avatar to PNG
convertSvgToPng('public/frankx-avatar-updated.svg', 'public/frankx-avatar-updated.png')
  .catch(error => console.error('Conversion failed:', error));
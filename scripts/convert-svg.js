const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Convert SVG to PNG
async function convertSvgToPng(svgPath, pngPath, width = 512, height = 512) {
  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convert to PNG
    await sharp(svgBuffer)
      .resize(width, height)
      .png()
      .toFile(pngPath);
    
    console.log(`Successfully converted ${svgPath} to ${pngPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  }
}

// Convert FrankX avatar
convertSvgToPng(
  path.join(__dirname, '../public/frankx-avatar.svg'),
  path.join(__dirname, '../public/frankx-avatar.png')
);
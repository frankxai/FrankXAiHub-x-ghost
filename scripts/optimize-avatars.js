
// Optimize and prepare FrankX avatar images
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Optimizing FrankX avatar images...');

// Ensure the directories exist
const publicDir = path.join(__dirname, '../public');

// Create optimized versions of all available avatars
const convertAndOptimize = () => {
  // Create a simple fallback avatar for maximum compatibility
  const simpleAvatar = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="256" fill="#0072C6" />
    <path d="M186 146H326V186H226V226H306V266H226V366H186V146Z" fill="white" />
  </svg>
  `;

  // Write the simple fallback to a file
  fs.writeFileSync(path.join(publicDir, 'frankx-avatar-simple.svg'), simpleAvatar);
  
  // Link all avatar variations to ensure they're all available
  const sourceFiles = [
    'frankx-avatar.svg',
    'frankx-avatar-updated.svg',
    'frankx-avatar-new.svg',
    'frankx-avatar-simple.svg'
  ];

  // Ensure all SVG files have corresponding PNG versions
  sourceFiles.forEach(svgFile => {
    const svgPath = path.join(publicDir, svgFile);
    const pngPath = svgPath.replace('.svg', '.png');
    
    if (fs.existsSync(svgPath)) {
      console.log(`Converting ${svgFile} to PNG...`);
      
      // If you have ImageMagick, use convert for better quality
      // Otherwise, you can use any other conversion method
      try {
        exec(`convert -background none -density 300 ${svgPath} ${pngPath}`, (error) => {
          if (error) {
            console.error(`Error converting ${svgFile}:`, error);
            console.log('Falling back to copying existing PNG...');
            
            // If conversion fails, copy an existing PNG as fallback
            if (fs.existsSync(path.join(publicDir, 'frankx-avatar.png'))) {
              fs.copyFileSync(
                path.join(publicDir, 'frankx-avatar.png'),
                pngPath
              );
              console.log(`Copied fallback PNG for ${svgFile}`);
            }
          } else {
            console.log(`Successfully converted ${svgFile} to PNG`);
          }
        });
      } catch (e) {
        console.error('ImageMagick not available, falling back to existing PNGs');
      }
    }
  });
  
  // Create a special optimized avatar version specifically for the chat interface
  const chatAvatarPath = path.join(publicDir, 'frankx-chat-avatar.png');
  try {
    // If source exists, create an optimized version specifically for chat
    if (fs.existsSync(path.join(publicDir, 'frankx-avatar-updated.png'))) {
      exec(`convert ${path.join(publicDir, 'frankx-avatar-updated.png')} -resize 128x128 ${chatAvatarPath}`, 
        (error) => {
          if (error) {
            console.error('Error creating chat avatar:', error);
            // Fall back to copying
            fs.copyFileSync(path.join(publicDir, 'frankx-avatar-updated.png'), chatAvatarPath);
          } else {
            console.log('Successfully created optimized chat avatar');
          }
        }
      );
    }
  } catch (e) {
    console.error('Error optimizing chat avatar, using original');
    // Just ensure we have a chat avatar file
    if (!fs.existsSync(chatAvatarPath) && fs.existsSync(path.join(publicDir, 'frankx-avatar-updated.png'))) {
      fs.copyFileSync(path.join(publicDir, 'frankx-avatar-updated.png'), chatAvatarPath);
    }
  }
};

convertAndOptimize();
console.log('Avatar optimization complete!');

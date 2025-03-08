// Avatar URLs - prioritized fallback chain for maximum reliability
const AVATAR_URLS = [
  '/frankx-chat-avatar.png',      // Optimized specifically for chat
  '/frankx-avatar-updated.png',   // Main avatar
  '/frankx-avatar-new.png',       // New design
  '/frankx-avatar.png',           // Original avatar
  '/frankx-avatar-fallback.png',  // Fallback
  '/frankx-avatar-simple.png',    // Ultra-simple fallback
];

// Preload function with robust error handling
const preloadAvatarImages = () => {
  try {
    // First check which avatars actually exist to set up the fallback chain
    const availableAvatars: string[] = [];

    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;

      // Register success
      img.onload = () => {
        console.log(`Successfully loaded ${src}`);
        availableAvatars.push(src);
      };

      // Log failure but don't stop
      img.onerror = () => {
        console.warn(`Failed to load ${src}`);
      };
    };

    // Preload all potential avatar images
    AVATAR_URLS.forEach(url => preloadImage(url));

    // Create an inline SVG fallback just in case nothing loads
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .frankx-avatar-fallback {
          background-color: #0072C6;
          position: relative;
        }
        .frankx-avatar-fallback::after {
          content: "F";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 24px;
        }
      </style>
    `);
  } catch (error) {
    console.warn("Error preloading avatar images:", error);
  }
};

// Call preload on module load
preloadAvatarImages();


// ... (rest of the component code) ...

//Example usage within the component
<img
              alt="FrankX.AI" 
              className="w-full h-full object-cover transition-opacity duration-300"
              onLoad={(e) => {
                // Fade in when loaded
                e.currentTarget.classList.add('opacity-100');
              }}
              style={{ opacity: 0.3 }} // Start slightly faded and fade in when loaded
              onError={(e) => {
                // Progressive fallback chain
                console.log("Avatar load failed, trying fallback");
                let currentIndex = AVATAR_URLS.findIndex(url => url === e.currentTarget.src.split('/').pop());

                // Try the next fallback if available
                if (currentIndex < AVATAR_URLS.length - 1) {
                  e.currentTarget.src = AVATAR_URLS[currentIndex + 1];
                } else {
                  // If all images fail, use CSS fallback
                  console.log("All avatar images failed to load, using CSS fallback");
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('frankx-avatar-fallback');
                    e.currentTarget.style.display = 'none';
                  }
                }
              }}
              srcSet={`${AVATAR_URLS[0]} 1x, ${AVATAR_URLS[0]} 2x`}
              src={AVATAR_URLS[0]}
            />
            <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-[#005CB2] to-[#00A3FF] animate-pulse shadow-[0_0_5px_rgba(0,163,255,0.5)]"></div>
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import https from "https";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ImageGenerationResult {
  url: string;
  localPath: string;
}

/**
 * Generate an image for a blog post using OpenAI DALL-E 3
 */
export async function generateBlogPostImage(
  title: string, 
  excerpt: string,
  category: string
): Promise<ImageGenerationResult> {
  const prompt = createBlogImagePrompt(title, excerpt, category);
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024", // High-quality banner size
      quality: "hd",
      style: "natural"
    });
    
    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL received from OpenAI");
    }
    
    // Download and save the image locally
    const localPath = await downloadImage(imageUrl, title);
    
    return {
      url: imageUrl,
      localPath
    };
  } catch (error) {
    console.error("Error generating blog post image:", error);
    throw new Error(`Failed to generate image: ${error}`);
  }
}

/**
 * Create a sophisticated prompt for blog post images
 */
function createBlogImagePrompt(title: string, excerpt: string, category: string): string {
  const categoryStyles = {
    'Strategy': 'professional boardroom setting with abstract business graphics, charts, and modern architecture',
    'Technology': 'sleek futuristic tech environment with holographic displays, data visualizations, and clean modern interfaces',
    'Technical': 'advanced computing environment with code interfaces, digital networks, and sophisticated technical diagrams',
    'Innovation': 'creative workspace with brainstorming elements, modern design thinking tools, and innovative concepts',
    'Leadership': 'executive office setting with leadership symbols, modern corporate architecture, and professional atmosphere',
    'AI & Machine Learning': 'cutting-edge AI laboratory with neural network visualizations, robotic elements, and advanced computing systems',
    'Data Science': 'data analytics workspace with complex visualizations, statistical charts, and modern dashboard interfaces',
    'Enterprise': 'corporate headquarters environment with modern office design, team collaboration spaces, and business technology'
  };
  
  const baseStyle = categoryStyles[category] || 'professional modern office environment with technology elements';
  
  return `Create a professional, high-quality banner image for a business blog post about "${title}". 

Style: ${baseStyle}

Visual Requirements:
- Modern, clean, and sophisticated aesthetic
- Professional color palette with blues, grays, and subtle accent colors
- High contrast and excellent readability
- Corporate/enterprise appropriate
- No text or typography in the image
- Photorealistic style with professional lighting
- Suitable for executive/C-suite audience
- Wide banner format (16:9 aspect ratio)

Content Context: ${excerpt.substring(0, 150)}

The image should convey professionalism, innovation, and expertise while being visually appealing and relevant to the topic.`;
}

/**
 * Download image from URL and save locally
 */
async function downloadImage(imageUrl: string, title: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create filename from title
    const filename = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '.jpg';
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'blog-images');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(imageUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        // Return the public URL path
        resolve(`/uploads/blog-images/${filename}`);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete partial file
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Generate images for all blog posts that don't have them
 */
export async function generateMissingBlogImages(): Promise<void> {
  const blogStorage = await import("./blog-storage");
  const posts = await blogStorage.getAllBlogPosts();
  
  console.log(`Checking ${posts.length} blog posts for missing images...`);
  
  for (const post of posts) {
    if (!post.imageUrl) {
      try {
        console.log(`Generating image for post: ${post.title}`);
        const result = await generateBlogPostImage(post.title, post.excerpt, post.category);
        
        // Update the blog post with the new image URL
        await blogStorage.updateBlogPost(post.id, { 
          imageUrl: result.localPath 
        });
        
        console.log(`✓ Generated image for: ${post.title}`);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`✗ Failed to generate image for ${post.title}:`, error);
      }
    }
  }
  
  console.log("Image generation process completed!");
}
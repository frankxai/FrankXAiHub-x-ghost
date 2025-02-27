import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { MusicSample } from "@shared/schema";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  ArrowDown, 
  ExternalLink, 
  Music as MusicIcon, 
  Share2, 
  Sparkles, 
  ListMusic, 
  Volume2,
  Globe
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type for Suno song
interface SunoSong {
  id: string;
  title?: string;
  isVideo?: boolean;
}

const Music = () => {
  const { data: musicSamples, isLoading } = useQuery<MusicSample[]>({
    queryKey: ['/api/music-samples'],
  });

  const [sunoInput, setSunoInput] = useState<string>("");
  const [currentSunoSong, setCurrentSunoSong] = useState<SunoSong | null>(null);

  // Extract Suno song ID from a URL
  const extractSunoSongId = (url: string): { id: string, isVideo: boolean } | null => {
    try {
      // Match patterns like https://suno.com/song/1cf7626c-1a71-41f0-a6c4-fd57d5ca2747
      const songRegex = /suno\.com\/song\/([a-zA-Z0-9-]+)/;
      const songMatch = url.match(songRegex);
      
      if (songMatch && songMatch[1]) {
        return { id: songMatch[1], isVideo: false };
      }
      
      // Match patterns like https://suno.com/video/123456 (for video content)
      const videoRegex = /suno\.com\/video\/([a-zA-Z0-9-]+)/;
      const videoMatch = url.match(videoRegex);
      
      if (videoMatch && videoMatch[1]) {
        return { id: videoMatch[1], isVideo: true };
      }
      
      // Detect YouTube video links
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const youtubeMatch = url.match(youtubeRegex);
      
      if (youtubeMatch && youtubeMatch[1]) {
        return { id: youtubeMatch[1], isVideo: true };
      }
      
      return null;
    } catch (e) {
      console.error("Error extracting media ID:", e);
      return null;
    }
  };

  // Handle Suno link submission
  const handleSunoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = extractSunoSongId(sunoInput);
    if (result) {
      setCurrentSunoSong({ 
        id: result.id, 
        isVideo: result.isVideo 
      });
    } else {
      alert("Please enter a valid Suno song URL (e.g., https://suno.com/song/1cf7626c-1a71-41f0-a6c4-fd57d5ca2747) or a YouTube link");
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 bg-gray-900 dark:bg-gray-900 text-white min-h-screen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-clash font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00C2FF] to-[#FF3366]">
            Create with Suno AI
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Generate stunning, professional-quality songs in seconds with simple text prompts
          </p>
          
          {/* Suno Embed Link Input */}
          <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
            <form onSubmit={handleSunoSubmit} className="space-y-4">
              <label className="block text-left text-lg font-medium mb-2">
                Share Your Suno Creation
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={sunoInput}
                  onChange={(e) => setSunoInput(e.target.value)}
                  placeholder="Paste Suno song or YouTube link (e.g., https://suno.com/song/...)"
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button 
                  type="submit" 
                  className="bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white"
                >
                  <MusicIcon className="mr-2 h-4 w-4" /> Load Song
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-left">
                Paste a Suno song or YouTube AI music video link to embed and share in our gallery
              </p>
            </form>
          </div>
        </div>
        
        {/* Current Suno Embed */}
        {currentSunoSong && (
          <section className="mb-20">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-clash font-bold">
                  {currentSunoSong.isVideo ? 'Your AI Music Video' : 'Your Suno Creation'}
                </h2>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      const url = currentSunoSong.isVideo
                        ? `https://youtube.com/watch?v=${currentSunoSong.id}`
                        : `https://suno.com/song/${currentSunoSong.id}`;
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => {
                      const url = currentSunoSong.isVideo
                        ? `https://youtube.com/watch?v=${currentSunoSong.id}`
                        : `https://suno.com/song/${currentSunoSong.id}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> {currentSunoSong.isVideo ? 'Open in YouTube' : 'Open in Suno'}
                  </Button>
                </div>
              </div>
              
              <div className="aspect-video w-full bg-black/30 rounded-xl overflow-hidden">
                {currentSunoSong.isVideo ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${currentSunoSong.id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="AI Music Video"
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <iframe 
                    src={`https://suno.com/embed/song/${currentSunoSong.id}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Suno AI Song"
                    className="w-full h-full"
                  ></iframe>
                )}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#00C2FF]/20 text-[#00C2FF]">
                  <Sparkles className="mr-1 h-3 w-3" /> AI Generated
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  <Volume2 className="mr-1 h-3 w-3" /> Commercial Use Available
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  <ListMusic className="mr-1 h-3 w-3" /> Multiple Styles
                </span>
              </div>
            </div>
          </section>
        )}
        
        {/* Featured Songs from Suno */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-clash font-bold">Featured Songs</h2>
            <Button 
              variant="link" 
              className="text-[#00C2FF]"
              onClick={() => window.open('https://suno.com/explore', '_blank')}
            >
              Explore More <ArrowDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pre-defined featured Suno songs */}
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://suno.com/embed/song/82968d8e-2246-4b94-a2d2-e643a0aefb9c"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Suno AI Song - Corporate Inspiration"
                  className="w-full h-full"
                ></iframe>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">Corporate Inspiration</h3>
                <p className="text-sm text-gray-400">Motivational corporate track with uplifting melody and modern production</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://suno.com/embed/song/14af1188-acb2-4070-adde-b3c9fcbf3cb7"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Suno AI Song - Tech Product"
                  className="w-full h-full"
                ></iframe>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">Tech Product Demo</h3>
                <p className="text-sm text-gray-400">Sleek electronic soundscape perfect for innovative product demonstrations</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://suno.com/embed/song/67b37058-7e72-41a1-8a1f-b407e41a9f29"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Suno AI Song - Ambient Workspace"
                  className="w-full h-full"
                ></iframe>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">Ambient Workspace</h3>
                <p className="text-sm text-gray-400">Calm, atmospheric music designed for focus and productivity</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Existing Music Samples */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-clash font-bold mb-8">FrankX.AI Music Library</h2>
          
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            className="mb-12"
          >
            {isLoading ? (
              <div className="bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse h-96"></div>
            ) : musicSamples && musicSamples.length > 0 ? (
              <MusicPlayer samples={musicSamples} />
            ) : (
              <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                <p className="text-gray-300">No music samples available. Please try again later.</p>
              </div>
            )}
          </motion.div>
        </section>
        
        {/* AI Music Tools Directory */}
        <section className="mb-20">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-clash font-bold">AI Music Tools Directory</h2>
              <Button 
                onClick={() => window.open('https://frankx-ai-resource-hub.notion.site/AI-Music-Tools-44a9bf5a6eec4f83a5de5e7ee51fd52c', '_blank')}
                className="mt-4 md:mt-0 bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white"
              >
                <Globe className="mr-2 h-4 w-4" /> Browse Full Directory
              </Button>
            </div>
            
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="mb-6 bg-gray-700">
                <TabsTrigger value="popular">Popular Tools</TabsTrigger>
                <TabsTrigger value="vocals">Voice & Vocals</TabsTrigger>
                <TabsTrigger value="instruments">Instruments</TabsTrigger>
                <TabsTrigger value="mastering">Mixing & Mastering</TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://suno.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1 flex items-center">
                      Suno
                      <span className="ml-2 px-2 py-0.5 bg-[#00C2FF]/20 text-[#00C2FF] text-xs rounded-full">Featured</span>
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">Complete song generation from text prompts with vocals and instruments</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> suno.com
                    </div>
                  </a>
                  
                  <a 
                    href="https://soundraw.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Soundraw</h3>
                    <p className="text-sm text-gray-400 mb-3">AI music generator for creators with customizable tracks</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> soundraw.io
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.aiva.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">AIVA</h3>
                    <p className="text-sm text-gray-400 mb-3">AI composer for emotional soundtracks and commercial music</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> aiva.ai
                    </div>
                  </a>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-gray-400 text-sm mb-4">
                    Our complete directory is maintained in Notion with over 50+ AI music tools and resources
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="vocals" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://www.voicemod.net/ai-voices/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Voicemod AI</h3>
                    <p className="text-sm text-gray-400 mb-3">AI voice generator and voice changer for content creation</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> voicemod.net
                    </div>
                  </a>
                  
                  <a 
                    href="https://elevenlabs.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">ElevenLabs</h3>
                    <p className="text-sm text-gray-400 mb-3">Ultra-realistic voice AI and voice cloning technology</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> elevenlabs.io
                    </div>
                  </a>
                  
                  <a 
                    href="https://uberduck.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Uberduck</h3>
                    <p className="text-sm text-gray-400 mb-3">Text-to-speech, voice cloning, and AI vocals for music</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> uberduck.ai
                    </div>
                  </a>
                </div>
              </TabsContent>
              
              <TabsContent value="instruments" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://soundful.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Soundful</h3>
                    <p className="text-sm text-gray-400 mb-3">Royalty-free instrumental music generator</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> soundful.com
                    </div>
                  </a>
                  
                  <a 
                    href="https://magenta.tensorflow.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Magenta</h3>
                    <p className="text-sm text-gray-400 mb-3">Google's open-source music and art generation research project</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> magenta.tensorflow.org
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.lalal.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Lalal.ai</h3>
                    <p className="text-sm text-gray-400 mb-3">Extract vocal, accompaniment and various instruments from any audio</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> lalal.ai
                    </div>
                  </a>
                </div>
              </TabsContent>
              
              <TabsContent value="mastering" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a 
                    href="https://www.landr.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">LANDR</h3>
                    <p className="text-sm text-gray-400 mb-3">AI-powered audio mastering, distribution and collaboration tools</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> landr.com
                    </div>
                  </a>
                  
                  <a 
                    href="https://moises.ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">Moises.ai</h3>
                    <p className="text-sm text-gray-400 mb-3">AI-powered music separation, tempo changing and vocal remover</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> moises.ai
                    </div>
                  </a>
                  
                  <a 
                    href="https://www.izotope.com/en/products/ozone.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-700/50 rounded-xl p-5 transition-all hover:bg-gray-700 hover:scale-[1.02]"
                  >
                    <h3 className="font-bold text-lg mb-1">iZotope Ozone</h3>
                    <p className="text-sm text-gray-400 mb-3">AI-assisted audio mastering and mixing suite</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" /> izotope.com
                    </div>
                  </a>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="mt-20">
          <div className="relative bg-gradient-to-r from-[#00C2FF]/20 to-[#FF3366]/20 rounded-2xl p-8 md:p-12 overflow-hidden border border-gray-700">
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">Create Your Own AI Music</h2>
                <p className="text-gray-300 text-lg mb-10">
                  Explore Suno, where AI transforms your ideas into complete songs with vocals, instruments, and production
                </p>
                <Button 
                  onClick={() => window.open('https://suno.com', '_blank')}
                  size="lg"
                  className="bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white px-8 py-6 text-lg"
                >
                  Get Started with Suno
                </Button>
                <p className="mt-6 text-gray-400 text-sm">
                  No musical experience required - Just describe your idea and let AI do the rest
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Music;

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { MusicSample } from "@shared/schema";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Button } from "@/components/ui/button";

const Music = () => {
  const { data: musicSamples, isLoading } = useQuery<MusicSample[]>({
    queryKey: ['/api/music-samples'],
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 bg-gray-900 text-white min-h-screen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">FrankX.AI Music</h1>
          <p className="text-lg text-gray-300">
            Generate custom AI music for your brand, products, and marketing campaigns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-clash font-bold mb-6"
              variants={itemVariants}
            >
              Transform Your Brand Experience
            </motion.h2>
            <motion.p 
              className="text-gray-300 mb-8"
              variants={itemVariants}
            >
              Our AI music generation platform creates unique, royalty-free soundscapes tailored to your brand identity and marketing needs.
            </motion.p>
            
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div className="flex" variants={itemVariants}>
                <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-clash font-bold text-lg mb-1">Brand Soundscapes</h4>
                  <p className="text-gray-400">Create signature audio identities that reinforce your brand across all touchpoints.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex" variants={itemVariants}>
                <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-clash font-bold text-lg mb-1">Podcast & Video Scores</h4>
                  <p className="text-gray-400">Generate custom background music for your content that enhances engagement.</p>
                </div>
              </motion.div>
              
              <motion.div className="flex" variants={itemVariants}>
                <div className="w-12 h-12 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-clash font-bold text-lg mb-1">Marketing Campaigns</h4>
                  <p className="text-gray-400">Create emotion-driven audio that connects with your target audience.</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div className="mt-10" variants={itemVariants}>
              <Button className="bg-secondary hover:bg-secondary/90 text-white">
                Try AI Music Generator
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
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
        </div>
        
        {/* How It Works Section */}
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-clash font-bold mb-10 text-center">How AI Music Generation Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6">
              <div className="w-14 h-14 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-clash font-bold text-secondary">1</span>
              </div>
              <h3 className="font-clash font-bold text-xl mb-3 text-center">Describe Your Sound</h3>
              <p className="text-gray-400 text-center">Define your desired musical style, mood, tempo, and instrumentation using natural language or reference tracks.</p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6">
              <div className="w-14 h-14 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-clash font-bold text-secondary">2</span>
              </div>
              <h3 className="font-clash font-bold text-xl mb-3 text-center">AI Composition</h3>
              <p className="text-gray-400 text-center">Our AI analyzes your inputs and generates multiple unique compositions tailored to your brand's sonic identity.</p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6">
              <div className="w-14 h-14 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl font-clash font-bold text-secondary">3</span>
              </div>
              <h3 className="font-clash font-bold text-xl mb-3 text-center">Refine & Download</h3>
              <p className="text-gray-400 text-center">Customize your favorite compositions with fine-grained controls, then download in multiple formats for any use case.</p>
            </div>
          </div>
        </section>
        
        {/* Use Cases Gallery */}
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-clash font-bold mb-6">Popular Use Cases</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 aspect-square flex items-center justify-center text-center hover:bg-gray-800 transition-colors cursor-pointer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <h3 className="font-clash font-bold text-lg mb-1">Product Videos</h3>
                <p className="text-gray-400 text-sm">Custom soundtracks for product demos and promotional videos</p>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 aspect-square flex items-center justify-center text-center hover:bg-gray-800 transition-colors cursor-pointer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="font-clash font-bold text-lg mb-1">Mobile Apps</h3>
                <p className="text-gray-400 text-sm">Interaction sounds and background audio for digital experiences</p>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 aspect-square flex items-center justify-center text-center hover:bg-gray-800 transition-colors cursor-pointer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="font-clash font-bold text-lg mb-1">Physical Spaces</h3>
                <p className="text-gray-400 text-sm">Custom ambient music for retail stores and office environments</p>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-30 rounded-xl p-4 aspect-square flex items-center justify-center text-center hover:bg-gray-800 transition-colors cursor-pointer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="font-clash font-bold text-lg mb-1">Presentations</h3>
                <p className="text-gray-400 text-sm">Background music for corporate presentations and pitch decks</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Music;

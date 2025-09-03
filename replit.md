# FrankX.AI - Enterprise AI Transformation Platform

## Overview

FrankX.AI is a sophisticated web platform designed as an AI Center of Excellence, serving as a global thought leadership hub for executives, AI builders, and innovation leaders. The platform combines enterprise AI transformation content, interactive AI agents, music generation capabilities, and comprehensive AI learning resources. It features a modern, Stripe-inspired UI with a premium aesthetic targeted at C-suite executives and AI/ML program managers.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (February 2025)

### Blog System Overhaul
- **Fixed "Too Many Articles" Bug**: Resolved issue where 150+ duplicate blog posts were being created on each server restart
- **Implemented Blog Post Cleanup**: Automated system that removes duplicates and maintains clean content (reduced from 150 to 5 posts)
- **Added AI Image Generation**: Integrated OpenAI DALL-E 3 for automatic blog post image generation with category-specific styling
- **Comprehensive UI/UX Redesign**: Implemented ModernBlogLayout with gradient backgrounds, glass morphism effects, and enhanced visual hierarchy

### CMS Integration Status
- **Dual System Architecture**: File-based blog storage with Sanity CMS integration as fallback
- **File System**: Primary storage in `data/blog/` with JSON index and individual post files
- **Sanity Integration**: Secondary CMS with comprehensive schema and API integration
- **Unified API**: Single blogApi service that seamlessly handles both systems with automatic failover

### Technical Improvements
- **Fixed CSS Animation Warnings**: Converted HSL color values to RGB format for better browser compatibility
- **Enhanced Error Handling**: Comprehensive ErrorBoundary components throughout the application
- **Loading State Optimization**: Modern skeleton components with proper animation and responsive design
- **Social Sharing Enhancement**: Multi-platform sharing with text selection toolbar for Twitter/X, LinkedIn, and native sharing

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built on Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui for consistent, accessible interface elements
- **Styling**: Tailwind CSS with custom theme configuration featuring FrankX.AI brand colors (near-black primary #171717, electric blue secondary #00C2FF, coral red accent #FF3366)
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth page transitions and micro-interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Development**: tsx for TypeScript execution in development
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **API Design**: RESTful endpoints with structured error handling and logging middleware

### Content Management Strategy
The platform implements a flexible multi-CMS approach:
- **Primary**: File-based blog storage system for immediate deployment and version control
- **Secondary**: Sanity CMS integration for rich content management capabilities
- **Tertiary**: Ghost CMS support for traditional blog workflows
- **Migration Tools**: Automated scripts to migrate between different CMS systems

### AI Integration Layer
- **Multiple Providers**: OpenAI and OpenRouter API integrations for diverse model access
- **Agent Framework**: Advanced agent system with skills, workflows, and memory capabilities
- **Persona System**: Multiple AI personalities (FrankX default, Technical Expert, Creative Writer, Research Analyst) with specialized prompting
- **Model Configuration**: Comprehensive model metadata including costs, capabilities, and optimization recommendations

### Authentication & Security
- Basic user authentication system with JWT tokens
- Environment-based API key management for external services
- CORS configuration for secure cross-origin requests

### File Processing & Utilities
- **File Conversion**: Dedicated routes for document and media format conversion
- **Image Optimization**: SVG to PNG conversion utilities for avatar management
- **Asset Management**: Static file serving with proper caching headers

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL via Neon Database serverless platform
- **Deployment**: Replit-optimized configuration with custom vite plugins

### AI Services
- **OpenAI API**: Primary AI completion service for chat and content generation
- **OpenRouter**: Multi-model API access for diverse AI capabilities
- **Model Providers**: Support for Anthropic Claude, OpenAI GPT, Google Gemini, and others

### Content Management Systems
- **Sanity CMS**: Structured content management with schema references
- **Ghost CMS**: Traditional blog platform integration
- **Tryghost Content API**: Ghost platform API client

### Development & Build Tools
- **Vite**: Fast development server and optimized production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **ESBuild**: Fast TypeScript compilation for server-side code
- **Drizzle Kit**: Database migration and schema management tools

### UI & Design
- **Radix UI**: Comprehensive component library for accessible interfaces
- **Lucide React**: Icon library for consistent visual elements
- **React Hook Form**: Form handling with Zod validation
- **React Syntax Highlighter**: Code syntax highlighting for technical content

### Additional Services
- **File Processing**: Sharp for image manipulation and optimization
- **Syntax Highlighting**: highlight.js for code block rendering
- **PDF Generation**: jsPDF for document export capabilities
- **Math Rendering**: KaTeX for mathematical expression display
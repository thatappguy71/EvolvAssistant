# Evolv - Personal Wellness & Habit Tracker

## Overview

Evolv is a comprehensive personal wellness and habit tracking application designed to help users transform their lives through intelligent habit tracking, wellness monitoring, and personalized biohacking insights. The application provides a holistic approach to health optimization by combining habit management, daily wellness metrics tracking, and a curated library of biohacks.

The platform enables users to build lasting habits with streak tracking, monitor key wellness indicators (energy, focus, mood, productivity, sleep quality), and discover scientifically-backed techniques for health optimization. Users can track their progress through detailed analytics and charts, bookmark favorite biohacks from an extensive library of 16 wellness techniques, and access premium features for enhanced functionality.

## Recent Updates (August 2025)

### Card Interaction System Overhaul
- **Removed all dropdown menus** - Eliminated confusing 3-dots menus throughout the application
- **Consistent clickable cards** - All habit and biohack cards now open detailed modal views
- **Today's Habits section** - Fully interactive with click-to-edit functionality and completion tracking
- **Biohack discovery** - Dashboard biohack cards and "Explore All" button now fully functional
- **Visual feedback system** - Hover effects, cursor pointers, scale animations, and arrow indicators
- **Modal detail views** - Comprehensive information display with edit/delete functionality for habits

### Notification System Implementation
- **Complete notification center** - Bell icon with badge counter and detailed modal interface
- **Persistent state management** - Notifications maintain read/unread status across navigation using localStorage
- **Interactive notification cards** - Click to navigate to relevant pages and automatically mark as read
- **Contextual navigation** - Achievement notifications → Analytics, Update notifications → Biohacks, Reports → Analytics
- **Full CRUD operations** - Mark individual/all as read, delete notifications with hover-revealed controls
- **Cross-page consistency** - Notification state and badge counts persist throughout entire application

### Responsive Sidebar Implementation
- **Fully responsive collapsible sidebar** with smooth transitions and dynamic content width adjustment
- **Mobile-first design** with hamburger menu, overlay, and proper touch interactions
- **Desktop functionality** with toggle button and icon-only collapsed state with tooltips
- **Consistent cross-page behavior** - all pages (Dashboard, Habits, Analytics, Biohacks, Wellness, Premium, Profile, Settings) respond to sidebar state changes
- **Auto-collapse navigation** - Sidebar automatically closes when navigation items are clicked on mobile devices
- **Dark mode compatibility** throughout all responsive states
- **Logo Protection Fix** - Menu button conditionally displays to prevent covering Evolv logo, with dedicated X close button for mobile

### Bookmark System Implementation
- **Optimistic UI updates** - Bookmark state changes immediately when clicked for instant feedback
- **Robust error handling** - Failed requests automatically revert to previous state with user notifications
- **Complete CRUD operations** - Add/remove bookmarks with persistent database storage
- **Enhanced API routing** - Backend properly returns all biohacks with user-specific bookmark status
- **Visual state indicators** - Clear filled/unfilled bookmark icons with proper color states
- **Modal bookmark functionality** - Consistent bookmark behavior between card view and detail modal
- **Real-time state synchronization** - Modal and card bookmark states stay perfectly synchronized

### Interactive Biohack Tools Implementation
- **Binaural Beats Audio Player** - Real-time frequency generation using Web Audio API with Alpha, Theta, and Delta waves
- **Breathing Exercise Guides** - Interactive 4-second cycle timers for Wim Hof and Box Breathing techniques
- **Session Timers** - Customizable meditation and therapy timers with progress tracking and completion notifications
- **Cold Therapy Temperature Guides** - Progressive temperature ranges for safe cold exposure progression
- **HIIT Workout Timers** - Structured interval training with automatic cycle management
- **Educational Content** - Dynamic explanations for brainwave frequencies and technique benefits
- **Safety Features** - Low volume audio settings and proper cleanup when sessions end

### Voice Guidance System Implementation
- **Natural Female Voice Selection** - Intelligent voice prioritization for human-like, calming guidance
- **Multi-tier Voice Quality** - Premium voices (Samantha, Karen, Victoria) → Good quality → Basic fallback
- **Voice Optimization** - Customized pitch, rate, and tone settings for each voice type
- **Cross-platform Compatibility** - Works on all devices with enhanced female voice detection
- **Error-resistant Design** - Comprehensive error handling prevents app crashes from voice issues

### Profile Management Fixes
- **Profile picture upload system** with proper file path handling and validation
- **Image format validation** supporting JPEG, PNG, GIF, WebP with clear error messages for unsupported formats (HEIF)
- **Database URL correction** ensuring uploaded images display correctly
- **File size limits** (5MB) and proper error handling for upload failures

### Mobile Header Layout Fix
- **Menu button overlap resolution** - Fixed mobile menu button overlapping with dashboard greeting text
- **Responsive header spacing** - Added proper left margin (ml-16) on mobile to account for fixed menu button positioning
- **Improved mobile navigation** - Preserved hamburger menu functionality while preventing text overlap

### Biohack Image Quality Enhancement
- **Unique technique-specific images** - Each biohack displays relevant, high-quality photos representing the specific wellness technique
- **300px height optimization** - All images standardized to 300px height for consistent display quality
- **Comprehensive error handling** - Images include onError handlers with fallback system and debug logging
- **Database refresh system** - Proper biohack data reset and reload functionality for image updates
- **Relevant visual representation** - Images accurately reflect each biohack (ice baths for cold therapy, forest scenes for forest bathing, etc.)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript in a Single Page Application (SPA) architecture. The UI is built with shadcn/ui components on top of Radix UI primitives, providing a consistent and accessible design system. Styling is handled through Tailwind CSS with custom CSS variables for theming. The application uses Wouter for client-side routing and TanStack Query for state management and server communication.

Key frontend design decisions:
- Component-based architecture with reusable UI components
- Custom hooks for authentication and API interactions
- Responsive design with mobile-first approach and collapsible sidebar functionality
- Chart.js integration for data visualization and analytics
- Shared sidebar context provider for consistent state management across all pages
- Dynamic content width adjustment based on sidebar state (64px collapsed, 256px expanded)

### Backend Architecture
The server follows an Express.js REST API architecture with TypeScript. The application uses a modular structure separating concerns into routes, storage, authentication, and database layers. The storage layer provides an abstraction over database operations, making it easy to maintain and test.

API design follows RESTful conventions with proper HTTP status codes and JSON responses. Error handling is centralized with custom middleware for consistent error responses. File upload handling is managed through Multer with proper validation, size limits, and organized storage in `/uploads/profile-images/` directory.

### Database Design
The application uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes core entities for users, habits, habit completions, daily metrics, biohacks, and user bookmarks. The database design supports:
- User management with subscription tiers and trial periods
- Habit tracking with categories, difficulty levels, and completion history
- Daily wellness metrics with numeric scores (1-10 scale)
- Biohacks library with categorization and user bookmarking
- Session storage for authentication state

### Authentication System
Authentication is handled through Replit's OpenID Connect (OIDC) integration using Passport.js. The system includes:
- Session-based authentication with PostgreSQL session storage
- User profile management with automatic creation on first login
- Protected routes with middleware-based authorization
- Seamless integration with Replit's identity provider

### Data Flow and State Management
The application follows a unidirectional data flow pattern:
- Client-side state is managed through TanStack Query with automatic caching and synchronization
- Server state is persisted in PostgreSQL with optimistic updates on the client
- Real-time data synchronization through query invalidation strategies
- Error boundaries and fallback states for resilient user experience

### External Integrations
- **Neon Database**: Serverless PostgreSQL hosting for production deployment
- **Replit Authentication**: OIDC-based user authentication and session management
- **Chart.js**: Data visualization for analytics and progress tracking
- **Replit Development Tools**: Hot reload, error overlay, and development banner integration

## External Dependencies

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database hosting
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect for database operations
- **drizzle-kit**: Database migration and schema management tooling

### Authentication and Sessions
- **openid-client**: OpenID Connect client for Replit authentication integration
- **passport**: Authentication middleware for Express.js applications
- **express-session**: Session management middleware with PostgreSQL storage
- **connect-pg-simple**: PostgreSQL session store for persistent session management

### Frontend Framework and UI
- **React**: Core UI library with TypeScript support
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight client-side routing solution
- **@radix-ui/***: Comprehensive collection of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library built on Radix UI

### Data Visualization and Analytics
- **chart.js**: Flexible charting library for wellness metrics and habit analytics
- **react-chartjs-2**: React wrapper for Chart.js integration

### Development and Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking for both client and server code
- **tsx**: TypeScript execution engine for server development
- **esbuild**: Fast JavaScript bundler for production builds

### Form Handling and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for form integration
- **zod**: Schema validation library for type-safe data validation
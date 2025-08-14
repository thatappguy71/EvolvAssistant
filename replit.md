# Evolv - Personal Wellness & Habit Tracker

## Overview
Evolv is a comprehensive personal wellness and habit tracking application designed to help users transform their lives through intelligent habit tracking, wellness monitoring, and personalized biohacking insights. It provides a holistic approach to health optimization by combining habit management, daily wellness metrics tracking, and a curated library of biohacks. The platform enables users to build lasting habits with streak tracking, monitor key wellness indicators (energy, focus, mood, productivity, sleep quality), and discover scientifically-backed techniques for health optimization. Users can track progress through detailed analytics, bookmark biohacks, and access premium features. Evolv aims to surpass competitors by offering a superior freemium model with transparent pricing ($4.99/month premium, 15 free habits) and a trust-first approach.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript in a Single Page Application (SPA) architecture, built with shadcn/ui components on top of Radix UI primitives for consistent and accessible design. Styling is handled with Tailwind CSS. Wouter is used for client-side routing and TanStack Query for state management. Key decisions include a component-based architecture, custom hooks for authentication and API interactions, responsive design with a mobile-first approach and collapsible sidebar, Chart.js for data visualization, and shared sidebar context for consistent state.

### Backend Architecture
The server follows an Express.js REST API architecture with TypeScript, using a modular structure separating concerns into routes, storage, authentication, and database layers. API design adheres to RESTful conventions with proper HTTP status codes and JSON responses. Error handling is centralized with custom middleware. File upload handling is managed through Multer.

### Database Design
The application uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema includes entities for users, habits, habit completions, daily metrics, biohacks, and user bookmarks, supporting user management with subscription tiers, habit tracking, daily wellness metrics, a biohacks library, and session storage.

### Authentication System
Authentication is handled through Replit's OpenID Connect (OIDC) integration using Passport.js, including session-based authentication with PostgreSQL session storage, user profile management, and protected routes with middleware-based authorization.

### Data Flow and State Management
The application follows a unidirectional data flow pattern, managing client-side state with TanStack Query and persisting server state in PostgreSQL with optimistic updates. Real-time data synchronization is achieved through query invalidation strategies.

### Core Features & Implementations
- **Card Interaction System:** Consistent clickable cards for habits and biohacks leading to detailed modal views, visual feedback, and comprehensive modal information with edit/delete functionality.
- **Notification System:** Complete notification center with bell icon, badge counter, persistent state management via localStorage, interactive notification cards with contextual navigation, and full CRUD operations.
- **Responsive Sidebar:** Fully responsive collapsible sidebar with smooth transitions, dynamic content width adjustment, mobile-first design with hamburger menu, and consistent cross-page behavior.
- **Bookmark System:** Optimistic UI updates, robust error handling, complete CRUD operations, enhanced API routing, visual state indicators, and real-time state synchronization.
- **Interactive Biohack Tools:** Binaural Beats Audio Player (Web Audio API), Breathing Exercise Guides, customizable Session Timers, Cold Therapy Temperature Guides, HIIT Workout Timers, and educational content.
- **Voice Guidance System:** Natural female voice selection with multi-tier quality (Premium, Good, Basic fallback), optimized pitch, rate, and tone, cross-platform compatibility, and error-resistant design.
- **Profile Management:** Profile picture upload system with file path handling, image format validation (JPEG, PNG, GIF, WebP), database URL correction, and file size limits (5MB).
- **AI Recommendations System:** Fully operational OpenAI (GPT-4o) integration generating personalized wellness recommendations based on user data analysis, interactive bookmark system, actionable "Take Action" buttons, automatic daily refresh, and confirmed working with ~12-second response time for comprehensive analysis (August 13, 2025).
- **Biohack Image Quality:** Unique, high-quality, technique-specific images (300px height) with error handling and fallback system.
- **Payment System:** Complete Stripe integration with Canadian pricing ($4.99 CAD monthly, $49.99 CAD yearly, $69.99 CAD family), secure checkout sessions, direct payment page bypassing authentication issues, and competitive family plan advantage.
- **Scientific Color Psychology System:** Research-backed color scheme optimized for wellness attention capture - Blue (23% productivity increase), Green (23% higher satisfaction), Orange (32% more clicks), Purple (27% perceived value), with interactive demo at `/color-demo` showcasing neurological benefits and University studies.
- **Custom Brand Icons:** User-designed SVG growth arrow with organic leaves on emerald green background, implemented across browser favicon, PWA manifest, landing page header, and sidebar logos. Complete brand consistency with cache-busting deployment strategy.
- **Location-Based Content System:** Automatic user location detection with browser geolocation API and IP fallback, region-specific resource mapping for different countries (CA, US, UK, AU), database storage of user location data, and location indicator with flag emoji display.
- **Daily Content Rotation System:** Smart algorithm that rotates habit resources daily based on habit name + date hash, providing fresh content every day while maintaining consistency. Users get different exercise videos, meditation guides, or apps each day they select the same habit, with 5-7 resources per habit type and visual "Fresh content every day!" indicators.
- **Beta Testing Infrastructure:** Complete feedback collection system with dedicated navigation section, comprehensive feedback form supporting bug reports and feature requests, database storage with priority levels and status tracking, and API routes for submission and management. Authentication required for data persistence - confirmed working with habit saving, metrics tracking, and all core functionality operational. Feedback submission fully operational with proper authentication, error handling, and database persistence (August 13, 2025).
- **Beta Signup System:** Fully operational beta application system with comprehensive form validation (name, email, motivation, experience, referral source), PostgreSQL database storage, automated SendGrid email notifications to admin, and complete admin interface for application management. Email notifications confirmed working with Single Sender Verification setup. Production-ready for beta user acquisition (August 14, 2025).
- **Analytics System:** Interactive habit completion trends with real-time data integration, dynamic time period selection (7/30/90 days), accurate percentage calculations based on actual habit data, and responsive chart updates - fully operational with live API integration (August 13, 2025).
- **Feedback Admin System:** Comprehensive admin interface at `/feedback-admin` with stats overview, tabbed filtering by feedback type, detailed submission management, status tracking, and priority indicators - fully integrated with sidebar navigation (August 13, 2025).

## External Dependencies

### Database and ORM
- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-kit`

### Authentication and Sessions
- `openid-client`
- `passport`
- `express-session`
- `connect-pg-simple`

### Frontend Framework and UI
- `React`
- `@tanstack/react-query`
- `wouter`
- `@radix-ui/*`
- `tailwindcss`
- `shadcn/ui`

### Data Visualization and Analytics
- `chart.js`
- `react-chartjs-2`

### Form Handling and Validation
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

### AI Integration
- `OpenAI` (for GPT-4o)
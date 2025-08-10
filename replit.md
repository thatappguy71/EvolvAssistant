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
- **AI Recommendations System:** Full OpenAI (GPT-4o) integration for personalized wellness recommendations based on user data, interactive bookmark system, actionable "Take Action" buttons, and automatic daily refresh.
- **Biohack Image Quality:** Unique, high-quality, technique-specific images (300px height) with error handling and fallback system.

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
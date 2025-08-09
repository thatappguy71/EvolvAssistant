# Evolv - Personal Wellness & Habit Tracker

## Overview

Evolv is a comprehensive personal wellness and habit tracking application designed to help users transform their lives through intelligent habit tracking, wellness monitoring, and personalized biohacking insights. The application provides a holistic approach to health optimization by combining habit management, daily wellness metrics tracking, and a curated library of biohacks.

The platform enables users to build lasting habits with streak tracking, monitor key wellness indicators (energy, focus, mood, productivity, sleep quality), and discover scientifically-backed techniques for health optimization. Users can track their progress through detailed analytics and charts, bookmark favorite biohacks, and access premium features for enhanced functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript in a Single Page Application (SPA) architecture. The UI is built with shadcn/ui components on top of Radix UI primitives, providing a consistent and accessible design system. Styling is handled through Tailwind CSS with custom CSS variables for theming. The application uses Wouter for client-side routing and TanStack Query for state management and server communication.

Key frontend design decisions:
- Component-based architecture with reusable UI components
- Custom hooks for authentication and API interactions
- Responsive design with mobile-first approach
- Chart.js integration for data visualization and analytics

### Backend Architecture
The server follows an Express.js REST API architecture with TypeScript. The application uses a modular structure separating concerns into routes, storage, authentication, and database layers. The storage layer provides an abstraction over database operations, making it easy to maintain and test.

API design follows RESTful conventions with proper HTTP status codes and JSON responses. Error handling is centralized with custom middleware for consistent error responses.

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
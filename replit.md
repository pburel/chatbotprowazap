# Overview

This project is a WhatsApp Business Chatbot Manager - a full-stack web application that allows businesses to manage their WhatsApp chatbot interactions. The system provides a comprehensive dashboard for monitoring conversations, configuring bot behavior, managing message templates, setting up automation rules, and analyzing chatbot performance metrics.

The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence. It's designed to help businesses streamline their customer support through automated WhatsApp responses while maintaining human oversight and control.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming, including WhatsApp-specific color schemes
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Recharts for data visualization in analytics dashboard

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas for runtime validation, shared between client and server
- **Development**: Hot module replacement via Vite integration in development mode

## Data Storage
- **Database**: PostgreSQL as the primary database
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Schema**: Comprehensive schema including users, conversations, messages, bot configuration, message templates, and analytics tables
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development/testing

## Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User System**: Role-based user system with admin capabilities
- **Security**: CORS-enabled API with credential support for secure cross-origin requests

## Key Features Architecture
- **Conversation Management**: Real-time chat interface with message history and status tracking
- **Bot Configuration**: Dynamic bot settings with welcome messages, response delays, and activation controls
- **Template System**: CRUD operations for message templates with categorization (support, sales, billing, general)
- **Automation Engine**: Rule-based automation system for handling common scenarios like business hours, escalations, and keyword responses
- **Analytics Dashboard**: Comprehensive metrics including message volume, response rates, user satisfaction, and performance tracking
- **Chat Simulator**: Interactive preview system for testing bot responses and message templates

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection for cloud deployment
- **drizzle-orm**: Type-safe PostgreSQL ORM with full TypeScript support
- **drizzle-zod**: Integration layer between Drizzle schema and Zod validation

## UI & Component Libraries
- **@radix-ui/***: Complete set of accessible, unstyled UI primitives (accordion, dialog, dropdown-menu, etc.)
- **@tanstack/react-query**: Powerful data fetching and state management library
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Utility for creating variant-based component APIs
- **embla-carousel-react**: Touch-friendly carousel component

## Form & Validation
- **react-hook-form**: Performant, flexible forms with easy validation
- **@hookform/resolvers**: Validation resolver library for integration with Zod
- **zod**: TypeScript-first schema validation library

## Development & Build Tools
- **vite**: Next-generation frontend build tool with HMR
- **@vitejs/plugin-react**: React plugin for Vite
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment
- **tsx**: TypeScript execution engine for Node.js development

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **wouter**: Minimalist routing library for React
- **recharts**: Composable charting library built on React components
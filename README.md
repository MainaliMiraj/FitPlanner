# 💪 FitPlanner - AI-Powered Fitness & Nutrition Coach

> Your personal 24/7 AI fitness companion that learns from your lifestyle and adapts to your goals. Built with Next.js, Supabase, and cutting-edge AI technology.

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

**A comprehensive fitness and nutrition management platform with AI-powered workout generation, meal planning, and progress tracking.**

[Live Demo](https://vercel.com/tempforall19-2557s-projects/v0-gym-planner-web-app) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🧠 Intelligent AI Coaching

- **24/7 AI Fitness Coach** - Conversational interface in the sidebar for real-time workout tips, nutrition advice, and motivation
- **Personalized Recommendations** - AI learns from your fitness profile and adapts suggestions specifically for you
- **Context-Aware Responses** - Includes exercise form tips, recovery advice, and lifestyle guidance based on your data
- **Conversation History** - All chats are saved per user for continuity and reference

### 📋 Onboarding Quiz

- **10-Question Fitness Assessment** - Captures your fitness goals, experience level, schedule, diet preferences, and health conditions
- **Smart Profile Building** - Quiz data feeds directly into AI algorithms for hyper-personalized recommendations
- **Comprehensive Insights** - Stores sleep patterns, stress levels, and health constraints for complete fitness context

### 🏋️ Workout Management

- **AI-Generated Workouts** - Create personalized workout plans using the AI generator
- **Custom Workouts** - Build your own routines with detailed exercise instructions
- **Progress Tracking** - Log workouts, track improvements, and monitor your fitness journey
- **Exercise Library** - Browse hundreds of exercises with proper form demonstrations

### 🍎 Nutrition Tracking

- **AI-Generated Meal Plans** - Get personalized meal plans based on your goals and dietary preferences
- **Custom Nutrition Plans** - Create and manage your own meal plans
- **Nutritional Insights** - Track calories, macros, and nutritional content
- **Dietary Preferences** - Support for various diet types (keto, vegan, paleo, etc.)

### 👤 User Dashboard

- **Profile Management** - Update your fitness goals, measurements, and preferences
- **Progress Analytics** - Visual charts and metrics tracking your fitness journey
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (free tier works great)
- Internet connection

### Installation

**1. Clone the Repository**
\`\`\`bash
git clone <your-repo-url>
cd fitplanner
npm install
\`\`\`

**2. Set Up Environment Variables**

In your v0 workspace:

- Navigate to the **Vars** section in the left sidebar
- Ensure these variables are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `SUPABASE_URL`
  - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

> All variables are auto-configured with the Supabase integration!

**3. Initialize Database**

Run these SQL scripts in your Supabase project (in order):

\`\`\`bash

# Execute each script in Supabase SQL Editor or via v0

scripts/001_create_schema.sql
scripts/002_create_profile_trigger.sql
scripts/003_update_profile_columns.sql
scripts/004_create_chat_messages_table.sql
scripts/005_create_exercise_library.sql
scripts/006_seed_exercise_library.sql
scripts/007_create_nutrition_schema.sql
scripts/fix-chat-schema-v2.sql
\`\`\`

**4. Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

Navigate to `http://localhost:3000` and start your fitness journey!

---

## 📖 How It Works

### User Journey

\`\`\`

1. Sign Up → Basic Info (Name, Email, Password)
   ↓
2. Complete Quiz → 10 Questions about fitness profile
   ↓
3. Verify Email → Confirmation link in inbox
   ↓
4. Enter Dashboard → Personalized fitness hub ready
   ↓
5. AI Takes Over → Generate workouts, meal plans, and chat 24/7
   \`\`\`

### AI Integration

- **Google Genimini Flash** powers all AI features with streaming responses
- **Supabase PostgreSQL** stores user data, conversations, and fitness history
- **Context-Aware** - AI uses quiz answers to understand your fitness context
- **Real-time** - Streaming responses with typing indicators for natural interaction

---

## 🏗️ Tech Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| **Frontend**         | Next.js 16, React 19, TypeScript       |
| **Styling**          | Tailwind CSS 4, shadcn/ui components   |
| **Backend**          | Next.js API Routes                     |
| **Database**         | Supabase PostgreSQL with RLS           |
| **AI**               | Vercel AI SDK, OpenAI/Anthropic models |
| **Auth**             | Supabase Auth with email verification  |
| **UI Components**    | Radix UI, Lucide Icons                 |
| **State Management** | React hooks, SWR for client data       |

---

## 📂 Project Structure

\`\`\`
fitplanner/
├── app/
│ ├── api/
│ │ ├── ai/
│ │ │ ├── fitness-coach/route.ts # 24/7 AI coach endpoint
│ │ │ ├── generate-workout/route.ts # Workout generation
│ │ │ └── generate-meal-plan/route.ts # Meal plan generation
│ │ ├── quiz/
│ │ │ └── save-answers/route.ts # Save quiz responses
│ │ └── auth/ # Auth endpoints
│ ├── auth/
│ │ ├── login/page.tsx
│ │ ├── sign-up/page.tsx # Signup + Quiz flow
│ │ └── sign-up-success/page.tsx
│ ├── dashboard/
│ │ ├── page.tsx # Main dashboard
│ │ ├── profile/page.tsx # Profile management
│ │ ├── workouts/page.tsx # Workout library
│ │ ├── nutrition/page.tsx # Meal plans
│ │ └── progress/page.tsx # Analytics
│ ├── globals.css # Global styles + design tokens
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/
│ ├── fitness-coach-sidebar.tsx # AI coach interface
│ ├── fitness-quiz.tsx # 10-question quiz
│ ├── dashboard-nav.tsx # Navigation
│ ├── ai-workout-form.tsx # Workout generator
│ ├── ai-meal-plan-form.tsx # Meal plan generator
│ └── ui/ # shadcn/ui components
├── lib/
│ ├── supabase/
│ │ ├── client.ts # Browser client
│ │ ├── server.ts # Server client
│ │ └── middleware.ts # Auth middleware
│ └── utils.ts # Utility functions
├── scripts/
│ ├── 001_create_schema.sql # Base schema
│ ├── 002_create_profile_trigger.sql # Auto profile creation
│ ├── 003_update_profile_columns.sql # Add quiz fields
│ └── ... # Other migrations
├── middleware.ts # Auth middleware
├── next.config.mjs # Next.js config
├── tailwind.config.js # Tailwind config
└── package.json # Dependencies

\`\`\`

---

## 🔑 Key Features Explained

### AI Fitness Coach

The sidebar chatbot uses the `useChat` hook from the Gemini AI to provide real-time responses. It sends your quiz data with every message so the AI understands your fitness context. Conversations are stored in the database with Row Level Security enabled.

### Quiz System

During signup, users answer 10 questions covering:

- Fitness goals (weight loss, muscle gain, endurance, flexibility)
- Experience level (beginner, intermediate, advanced)
- Available time per week
- Dietary preferences (omnivore, vegetarian, vegan)
- Health conditions (injuries, restrictions)
- Sleep hours and stress levels

This data is stored in the `profiles` table and used by all AI features.

### AI Personalization

The meal plan and workout generators query the user's profile data and include it in the AI prompt. This ensures all recommendations align with the user's fitness goals, experience level, and constraints.

---

## 🗄️ Database Schema

### Core Tables

- **users** - Supabase Auth users
- **profiles** - Extended user data (fitness goals, measurements, quiz answers)
- **chat_conversations** - Stores AI coach chat sessions per user
- **chat_messages** - Individual messages in conversations
- **workouts** - User-created and AI-generated workouts
- **meals** - Nutrition plans and meal data
- **exercises** - Exercise library (pre-seeded)

All tables have Row Level Security (RLS) enabled to ensure users can only access their own data.

---

## 🚢 Deployment

### Deploy to Vercel

\`\`\`bash

# Install Vercel CLI

npm install -g vercel

# Deploy

vercel

# Follow the prompts to connect to GitHub

\`\`\`

Environment variables are automatically synced from v0 workspace.

### Alternative: Docker

\`\`\`bash
docker build -t fitplanner .
docker run -p 3000:3000 fitplanner
\`\`\`

---

## 🔐 Security

- **Row Level Security (RLS)** - All database queries are restricted to the logged-in user
- **Secure Authentication** - Email/password auth with Supabase
- **Environment Variables** - Sensitive keys stored securely in Vercel
- **CORS Protection** - API routes validate requests properly
- **Rate Limiting** - AI endpoints have built-in rate limiting

---

## 📊 Performance

- **Lightweight** - Minimal JavaScript, optimized components
- **Fast AI Streaming** - Real-time streaming responses for instant feedback
- **Efficient Queries** - Indexed database tables for quick data retrieval
- **Caching** - SWR for client-side data caching and revalidation
- **Code Splitting** - Automatic route-based code splitting with Next.js

---

## 🐛 Troubleshooting

### Black Screen Issue

If you see a black screen on dashboard:
\`\`\`bash

# Clear browser cache

npm run dev

# Refresh the page

\`\`\`

### Chat Not Appearing

- Ensure you're on a desktop screen (1280px width or larger)
- Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set in environment variables
- Verify chat schema migration was applied: `scripts/fix-chat-schema-v2.sql`

### Quiz Not Saving

- Check Supabase connection in browser DevTools
- Verify `fix-chat-schema-v2.sql` script ran successfully
- Ensure `profiles` table has all quiz columns

### AI Endpoints Returning Errors

- Verify Vercel AI SDK is installed: `npm install ai`
- Check that OpenAI/Anthropic model string is correct in API routes
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and auth keys are set

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Visit [Vercel Support](https://vercel.com/help)
- Check existing documentation

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI Components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide React](https://lucide.dev/)

---

**Made with ❤️ for fitness enthusiasts** 💪

_Last updated: November 2025_

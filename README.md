# 💪 FitPlanner

> Next.js + Supabase fitness OS with AI-generated workouts, nutrition plans, progress tracking, and a contextual chat coach powered by Google Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2-149eca?style=for-the-badge&logo=react)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Supabase](https://img.shields.io/badge/Supabase-Postgres-3fcf8e?style=for-the-badge&logo=supabase)](https://supabase.com/) [![Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)

FitPlanner is a full-stack fitness companion. Users complete a multi-step onboarding quiz, generate AI workouts and nutrition plans, manage custom routines, log progress, and chat with a contextual coach—everything stored in Supabase with row-level security.

## ✨ Highlights
- AI meal/workout generators plus a persistent chat coach using Google Gemini 2.0 Flash
- Guided onboarding quiz (18 prompts) that persists in localStorage and hydrates Supabase `profiles`
- Dashboard OS with workout planner, nutrition studio, and progress analytics
- Local-first UX: onboarding, user, and nutrition contexts cache data in the browser for instant reloads
- Supabase schema + SQL scripts for workouts, meals, logs, chat history, nutrition plans, and more
- Built with the Next.js App Router, Server Components, and shadcn/ui + Tailwind CSS 4

## 🧱 Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19 Server/Client Components, TypeScript 5, Tailwind CSS 4, shadcn/ui (Radix Primitives), Framer Motion
- **State**: React Context providers (`context/*.tsx`) with JSON localStorage hydration utilities in `lib/storage.ts`
- **Backend**: Supabase (Auth + Postgres + RLS policies defined in `/scripts`), server-side data fetching via `lib/supabase/server.ts`
- **AI**: Google Generative AI (Gemini 2.0 Flash) for workouts, meal plans, the nutrition strategy builder, and the chat coach
- **UX extras**: Sonner toasts, Lucide icons, CMDK, Recharts wrappers (`components/ui/chart.tsx`), Embla carousel, etc.

## 🧩 Feature Breakdown
### Onboarding & Profile Intelligence
- `app/onboarding` renders `OnBoardingQuiz` with animations (`framer-motion`) and question data from `data/Questions.ts`
- Answers persist through the `OnboardingProvider` (localStorage) and are inserted into Supabase via `hooks/useRegister.ts`
- `/dashboard/profile` hydrates `ProfileForm` plus preference accordions so users can edit their data later

### Workout Operating System
- `/dashboard/workouts` lists Supabase workouts through the `WorkoutCard` component with stats/filters
- Manual builder (`CreateWorkoutForm`) and AI generator (`AIWorkoutForm` + `/api/ai/generate-workout`) both write workouts + exercises tables
- Detail pages show exercise breakdowns and allow logging via `StartWorkoutButton` → `workout_logs`

### Nutrition Studio
- `/dashboard/nutrition` is powered by `NutritionPageClient`, merging Supabase data with the nutrition context
- Generate structured plans with `/api/nutrition-plan` (calls Gemini with profile + quiz context) or use the lightweight AI meal plan creator at `/dashboard/nutrition/ai-generate`
- Manual plans are handled by `CreateMealPlanForm` and displayed through `MealPlanCard` + route pages

### Progress & Analytics
- `/dashboard/progress` aggregates `workout_logs` and `body_measurements` with quick stats, tables, and CTA cards
- `AddMeasurementForm` writes to `body_measurements`, enabling trend visualizations once charts/tables consume the data

### AI Coach & Conversations
- `FitnessCoachSidebar` pins an expandable chat bubble across dashboard routes
- `/api/ai/fitness-coach` streams Gemini responses with Supabase profile context and stores replies to `chat_messages` scoped by `conversations`

### Platform Guardrails
- Supabase SQL migrations define tables, triggers, and RLS policies for every entity (profiles, workouts, meals, logs, chats, nutrition plans, exercise library, goals, etc.)
- Server Components fetch Supabase data via `createClient()` while client components use the browser client for mutations
- Auth-gated routes live under `app/dashboard/*`; non-auth flows (marketing, onboarding, auth screens) remain public

## 🏗️ Architecture & Data Flow
1. Visitor lands on `/` and can jump into onboarding; quiz answers hydrate local context immediately.
2. During sign-up (`hooks/useRegister.ts`) answers + profile metadata are persisted into Supabase `profiles`.
3. Authenticated users enter `/dashboard` where each route is a Server Component fetching its slice (workouts, meals, logs, nutrition plan JSON, etc.).
4. Client-side forms (workouts, meals, measurements) call Supabase directly, then trigger router refreshes for live data.
5. AI endpoints under `app/api/ai/*` and `/api/nutrition-plan` enrich Supabase data (workouts, meals, `nutrition_plans`, `chat_messages`).
6. `context/user-context.tsx`, `context/nutrition-context.tsx`, and `context/onboarding-context.tsx` keep the UI resilient to refreshes/offline moments by mirroring Supabase state locally.

## 📁 Directory Map
| Path | Notes |
| --- | --- |
| `app/` | Next.js routes, layouts, and API handlers (e.g., `/dashboard`, `/auth`, `/api/ai/*`, `/api/nutrition-plan`). |
| `components/` | UI building blocks (`ui/*`), domain features (AI forms, nutrition dashboard, workout cards, chat sidebar, etc.). |
| `context/` | React providers for onboarding, nutrition, and user/profile state. |
| `lib/` | Supabase client/server helpers, nutrition utilities, storage helpers, and misc utils. |
| `scripts/` | Supabase SQL migrations plus seeding scripts for exercises, chat, nutrition, and policy fixes. |
| `data/` | Static quiz configuration. |
| `styles/`, `public/` | Tailwind globals and static assets.

## 🔐 Environment Variables
Create `.env.local` with the following keys (Git ignored):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key used on both server/client. |
| `GOOGLE_API_KEY` | Google AI Studio API key with access to Gemini 2.0 Flash. |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Optional: overrides auth redirect when developing locally (defaults to `/dashboard`). |

```bash
cp .env.example .env.local # if you keep a sample file
# then edit .env.local as needed
```

## 🚀 Getting Started
1. **Install dependencies**
   ```bash
   npm install        # or pnpm install / bun install
   ```
2. **Provision Supabase**
   - Create a new project
   - Enable email/password auth
   - Run the SQL files listed below in the Supabase SQL Editor (they are idempotent)
3. **Set environment variables** (see table above)
4. **Start Next.js**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` for the marketing page and onboarding flow.

## 🗄️ Database & Supabase Scripts
Run these migrations sequentially (or apply relevant ones as needed):

| File | Purpose |
| --- | --- |
| `scripts/001_create_schema.sql` | Core tables for profiles, workouts, exercises, meal plans, meals, workout/exercise logs, and measurements + RLS. |
| `scripts/002_create_profile_trigger.sql` | Auto-creates a minimal profile row for every new Supabase user. |
| `scripts/003_update_profile_columns.sql` | Adds all onboarding quiz columns to `profiles`. |
| `scripts/004_rebuild_profiles.sql` | Drops/recreates `profiles` with quiz-friendly columns + policies (safe to run on fresh DB). |
| `scripts/004_create_chat_messages_table.sql` | Creates `chat_messages` with policies for the AI chat history. |
| `scripts/add-chat-schema.sql` & `scripts/fix-chat-schema-v3.sql` | Adds `conversations` table, links chats to conversations, and refreshes policies/indexes (run the latest v3 script if unsure). |
| `scripts/005_create_exercise_library.sql` | Exercise library + user goals/milestones schema with RLS. |
| `scripts/006_seed_exercise_library.sql` | Seeds the exercise library with multi-bodypart movements. |
| `scripts/007_create_nutrition_schema.sql` | Recipes, macro targets, shopping lists, meal schedule, and related policies. |
| `scripts/008_create_nutrition_plans.sql` | Stores normalized AI nutrition plans (`nutrition_plans` JSONB table). |
| `scripts/008_fix_profiles_rls_policies.sql` | Ensures `profiles` has the correct insert/update/delete rules (including anon inserts post-sign-up). |
| `scripts/009_drop_include_veggies.sql` | Cleans up legacy quiz columns (safe no-op on new DBs). |

> Tip: keep `scripts/all schema.sql` handy if you want to inspect the combined schema or run everything at once.

## 🧠 AI & External Services
- Workout generator → `POST /api/ai/generate-workout`
- Meal plan generator → `POST /api/ai/generate-meal-plan`
- Nutrition strategy (weekly plan, recipes, shopping list) → `POST /api/nutrition-plan`
- Chat coach → `POST /api/ai/fitness-coach`

All routes require a valid Supabase session and `GOOGLE_API_KEY` to call Gemini 2.0 Flash. Responses are parsed/validated before persisting to Supabase.

## 📟 Available npm Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in dev mode with hot reload. |
| `npm run build` | Compile the production bundle. |
| `npm run start` | Serve the production build. |

## 🧰 Troubleshooting
- **Auth redirect loops** → Ensure `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` match your Supabase project and set `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` when using custom ports.
- **AI endpoints return 401** → User must be logged in; check the Supabase session cookie and confirm the row exists in `profiles`.
- **AI responses fail to parse** → Verify your Gemini key is valid and the selected model is available to the project; logs appear in `app/api/*/route.ts` catch blocks.
- **Chat sidebar missing history** → Run `scripts/fix-chat-schema-v3.sql` so `conversations` + `chat_messages` share foreign keys and RLS policies.
- **Database errors on insert** → Confirm the SQL migrations were applied and that RLS policies allow the actor (e.g., anon insert on sign-up vs authenticated updates).

## 🤝 Contributing
1. Fork & branch (`git checkout -b feature/xyz`)
2. Implement changes + tests/SQL updates if needed
3. Run `npm run build` (or the relevant feature) locally
4. Open a PR with screenshots, schema diffs, or notes about Supabase changes

## 📝 License
MIT — see `LICENSE`.

## 💬 Support
Open a GitHub issue or reach out via your deployment platform (Vercel/Supabase). Gemini quota issues should be handled inside Google AI Studio.

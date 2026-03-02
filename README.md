# SpineSurgNet

A professional networking platform for spine surgeons, built with Next.js, Prisma, and PostgreSQL.

## Features

- Surgeon directory with advanced filtering (specialty, location, conference)
- User authentication with role-based access (surgeon / admin)
- Surgeon profile management with avatar uploads
- Conference tracking and affiliation management
- Admin dashboard with analytics and data export

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth v5 (JWT strategy)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local database URL

# Push database schema
npx prisma db push

# Seed the database
npm run db:seed

# Start dev server
npm run dev
```

Open http://localhost:3000 to view the app.

## Deploy to Vercel (via GitHub)

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/SpineSurgNet.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js -- no build settings needed

### 3. Add a PostgreSQL Database

1. In your Vercel project, go to **Storage** > **Create Database** > **Postgres**
2. This auto-populates `DATABASE_URL` and `DIRECT_URL` environment variables

### 4. Set Environment Variables

In Vercel project settings > **Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL (e.g. `https://spinesurgnet.vercel.app`) |

`DATABASE_URL` and `DIRECT_URL` are set automatically by Vercel Postgres.

### 5. Deploy & Seed

Vercel deploys automatically on push. After the first deploy:

```bash
# Run migrations against production DB
npx prisma db push

# Seed conferences and admin user
npm run db:seed
```

Or use the Vercel CLI:

```bash
npx vercel env pull .env.local
npx prisma db push
npm run db:seed
```

## Default Admin Credentials

After seeding: `admin@spinesurgnet.com` / `admin123`

Change the admin password immediately after first login in production.

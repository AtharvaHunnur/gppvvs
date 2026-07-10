# G.P. Porwal College - Backend API

Express.js + TypeScript + Prisma API for the GPPVVS College platform.

## Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 17.7 (AWS Aurora Serverless v2)
- **ORM**: Prisma
- **Auth**: JWT-based access and refresh tokens
- **Media**: Local storage (`/uploads`) mapped to frontend Vite proxy

## Setup & Run

1. Install dependencies:
```bash
npm install
```

2. Setup `.env`:
```
DATABASE_URL="postgresql://postgres:gppvvs@2026@database-1.cluster-c3yu80sc4r7t.eu-central-1.rds.amazonaws.com:5432/postgres?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
UPLOAD_DIR="uploads"
```

3. Initialize Database:
```bash
npx prisma generate
npx prisma db push
```

4. Seed the Database:
```bash
npx tsx prisma/seed.ts
```

5. Start Server:
```bash
npm run dev
```

## Available Scripts
- `npm run dev`: Start dev server with nodemon/ts-node
- `npm run build`: Compile TypeScript to `dist/`
- `npm start`: Run production build

# Deployment Guide - Vercel & Production Setup

## 🚀 Vercel Deployment

### Prerequisites
- GitHub account with your code repository
- Vercel account (free tier available)
- All environment variables ready

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select "Next.js" framework preset

### Step 2: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123

# AI Services
NEXT_PUBLIC_GEMINI_API_KEY=AIza...

# Video Calling
NEXT_PUBLIC_LIVEKIT_URL=wss://your-instance.livekit.cloud
NEXT_PUBLIC_LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret

# Production URLs
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Visit your deployed URL

### Step 4: Custom Domain (Optional)

1. In Vercel dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate will be automatically provisioned

## 🏗️ Production Optimizations

### 1. Next.js Performance Config

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp'],
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com'
    ],
  },
  
  // Bundle analyzer (for debugging)
  ...(process.env.ANALYZE === 'true' && {
    experimental: {
      bundlePagesRouterDependencies: true,
    },
  }),
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig
```

### 2. Bundle Size Optimization

Add bundle analyzer:
```bash
npm install @next/bundle-analyzer
```

Update package.json:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "build-stats": "npx @next/bundle-analyzer"
  }
}
```

### 3. Performance Monitoring

Install Vercel Analytics:
```bash
npm install @vercel/analytics
```

Update `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔒 Security Configuration

### 1. Firebase Security Rules (Production)

Update Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Rate limiting
    match /{document=**} {
      allow read, write: if request.auth != null 
        && request.time > resource.data.lastActivity + duration.value(1, 's');
    }
    
    // Public data with write restrictions
    match /artifacts/focus-os-studyverse/public/data/leaderboard_scores/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.totalFocusTime is number
        && request.resource.data.totalFocusTime >= 0;
    }
    
    // Study rooms with participant limits
    match /artifacts/focus-os-studyverse/public/data/study_rooms/{roomId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null 
        && request.resource.data.createdBy == request.auth.uid;
      allow update: if request.auth != null 
        && (request.auth.uid == resource.data.createdBy 
            || request.auth.uid in resource.data.participants);
    }
    
    // Private user data
    match /artifacts/focus-os-studyverse/users/{userId}/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.keys().hasAll(['displayName', 'email']);
    }
  }
}
```

### 2. API Route Protection

Create middleware for API protection:
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1'
    const rateLimitKey = `rate_limit_${ip}`
    
    // Implement your rate limiting logic here
    // (could use Vercel KV or external service)
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

## 📊 Monitoring & Analytics

### 1. Error Tracking with Sentry

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 2. User Analytics with PostHog

```bash
npm install posthog-js
```

Create analytics wrapper:
```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com'
  })
}

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    posthog.capture(event, properties)
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    posthog.identify(userId, traits)
  },
  
  page: (name: string) => {
    posthog.capture('$pageview', { page: name })
  }
}
```

### 3. Performance Monitoring

Add Web Vitals tracking:
```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run build
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          # Add other environment variables
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🌍 Global Deployment Strategy

### 1. Edge Regions

Configure Vercel for global distribution:
```typescript
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "edge"
    }
  },
  "regions": ["iad1", "sfo1", "fra1", "sin1"]
}
```

### 2. CDN Optimization

Configure caching headers:
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  }
}
```

## 📱 Progressive Web App (PWA)

### Install PWA Dependencies
```bash
npm install next-pwa
```

### Configure PWA
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // your existing config
})
```

### Add PWA Manifest
Create `public/manifest.json`:
```json
{
  "name": "Focus OS",
  "short_name": "Focus OS",
  "description": "AI-powered study platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🧪 Testing in Production

### 1. Health Check Endpoint
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### 2. Feature Flags
```typescript
// src/lib/featureFlags.ts
export const FEATURE_FLAGS = {
  videoRooms: process.env.NODE_ENV === 'production',
  advancedAI: process.env.FEATURE_ADVANCED_AI === 'true',
  parentDashboard: false, // Coming soon
}
```

## 📈 Cost Optimization

### 1. Firebase Optimization
- Enable compression for Firestore
- Use composite indexes efficiently
- Implement pagination for large datasets
- Cache frequently accessed data

### 2. Vercel Optimization
- Use Edge Functions for simple operations
- Implement proper caching strategies
- Optimize bundle size
- Monitor bandwidth usage

### 3. AI Cost Management
- Cache AI responses when appropriate
- Implement request deduplication
- Use shorter prompts when possible
- Rate limit AI requests per user

## Production Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured (PostHog/Vercel)
- [ ] Performance monitoring enabled
- [ ] PWA manifest and icons added
- [ ] Health check endpoint created
- [ ] CI/CD pipeline configured
- [ ] Custom domain connected (if applicable)
- [ ] SSL certificate verified

Your Focus OS is now ready for production! 🎉
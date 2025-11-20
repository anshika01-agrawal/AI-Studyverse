#!/bin/bash
echo "🎯 Starting Focus OS Development Environment..."
echo "================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please update with your API keys"
    echo "📝 Edit .env.local with your Firebase, Gemini AI, and LiveKit credentials"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the development server
echo "🚀 Starting Next.js development server..."
echo "📱 Open http://localhost:3000 in your browser"
echo "🎯 Focus OS - Study Smart, Stay Focused"
echo ""

npm run dev
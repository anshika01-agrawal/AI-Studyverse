#!/bin/bash

echo "🎯 Manual Start Script for Focus OS"
echo "=================================="

# Set the working directory
cd /workspaces/AI-Studyverse

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the right directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local 2>/dev/null || echo "# Basic config" > .env.local
fi

# Start the development server
echo "🚀 Starting Next.js development server..."
echo "📱 Server will be available at http://localhost:3000"
echo ""

# Start with verbose output
npm run dev -- --port 3000

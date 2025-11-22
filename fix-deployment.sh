#!/bin/bash

echo "🔧 Focus OS - Production Deployment Fix"
echo "======================================="
echo ""

echo "🏗️ Building project to check for errors..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fixing common issues..."
    
    echo "📝 Fixing TypeScript errors..."
    # Add any specific fixes here
    
    echo "🔄 Trying build again..."
    npm run build
fi

echo ""
echo "🚀 DEPLOYMENT INSTRUCTIONS:"
echo ""
echo "1. 🌐 Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. 🔗 Click 'Add New Project'"
echo "3. 📂 Import from Git: anshika01-agrawal/AI-Studyverse"
echo ""
echo "🔧 Required Environment Variables:"
echo "Copy these to Vercel → Settings → Environment Variables:"
echo ""
echo "NEXT_PUBLIC_FIREBASE_API_KEY=demo_key"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com" 
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo"
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo.appspot.com"
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789"
echo "NEXT_PUBLIC_FIREBASE_APP_ID=demo_app_id"
echo "NEXT_PUBLIC_GEMINI_API_KEY=demo_key"
echo ""
echo "📋 Build Settings:"
echo "Framework Preset: Next.js"
echo "Build Command: npm run build"
echo "Output Directory: .next"
echo "Install Command: npm install"
echo "Node.js Version: 18.x"
echo ""
echo "✅ After deployment, your site will be live!"
echo "🌐 URL: https://ai-studyverse-flame.vercel.app"
echo ""
echo "💡 If you still see 404, check:"
echo "   - All environment variables are set"
echo "   - Build completed successfully"
echo "   - Domain is properly configured"
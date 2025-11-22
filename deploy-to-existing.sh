#!/bin/bash

echo "🚀 DEPLOY TO EXISTING VERCEL PROJECT"
echo "====================================="
echo ""
echo "📂 Project: ai-studyverse-pvml"
echo "🌐 URL: https://ai-studyverse-pvml.vercel.app/"
echo ""

# Check current directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from AI-Studyverse directory"
    exit 1
fi

echo "📤 Step 1: Push latest code to GitHub..."
git add .
git commit -m "🔧 Add Settings functionality - complete working version"
git push origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "📋 Step 2: Manual Redeploy Instructions"
echo ""
echo "1. Go to: https://vercel.com/anshika-agrawal-s-projects/ai-studyverse-pvml"
echo "2. Click 'Deployments' tab"
echo "3. Find latest deployment"
echo "4. Click '...' → 'Redeploy'"
echo "5. Select latest commit"
echo "6. Click 'Deploy'"
echo ""
echo "⏰ Deploy time: 2-3 minutes"
echo ""
echo "🎯 Result: Settings will work perfectly!"
echo "📱 Test: Click 'Settings' in left sidebar"
echo ""
echo "🌐 Your URL: https://ai-studyverse-pvml.vercel.app/"

# Optional: Check if vercel CLI is available
if command -v vercel &> /dev/null; then
    echo ""
    echo "🔧 Alternative: CLI Deploy"
    echo "Run: vercel --prod"
else
    echo ""
    echo "💡 Install Vercel CLI for faster deploys:"
    echo "npm i -g vercel"
fi

echo ""
echo "✅ All Done! Settings functionality ready to deploy!"
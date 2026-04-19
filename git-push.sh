#!/bin/bash

# Git Setup and Push Script for ClassMate.info
# Run this after installing Xcode Command Line Tools

echo "🚀 ClassMate.info - Git Setup and Push"
echo "======================================="
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if Xcode Command Line Tools are installed
if ! xcode-select -p &> /dev/null; then
    echo "❌ Xcode Command Line Tools not found."
    echo "📦 Installing Xcode Command Line Tools..."
    echo "   A dialog will appear - click 'Install' and wait."
    xcode-select --install
    echo ""
    echo "⏳ Please wait for installation to complete, then run this script again."
    exit 1
fi

echo "✅ Git and Xcode Command Line Tools are installed"
echo ""

# Check if already a git repository
if [ -d .git ]; then
    echo "✅ Git repository already initialized"
else
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi
echo ""

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already exists"
    git remote -v
else
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/sibasishmisra/classmate.git
    echo "✅ Remote added"
    git remote -v
fi
echo ""

# Check git status
echo "📋 Checking git status..."
git status --short
echo ""

# Ask for confirmation
read -p "📤 Ready to commit and push? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Stage all files
echo "📦 Staging all files..."
git add .
echo "✅ Files staged"
echo ""

# Create commit
echo "💾 Creating commit..."
git commit -m "feat: Complete ClassMate.info implementation with full sound system

- Add Enter key submission for questions (Shift+Enter for new line)
- Implement all 4 sound effects (bell, page-turn, chalk-tap, success-chime)
- Add sounds to level selection, buttons, explanation completion, and follow-ups
- Create comprehensive FAQ section with help page
- Add Settings panel with sound/animation toggles
- Implement content safety filtering and rate limiting
- Complete responsive design and accessibility features
- Add comprehensive documentation and setup guides"

if [ $? -eq 0 ]; then
    echo "✅ Commit created"
else
    echo "❌ Commit failed"
    exit 1
fi
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
echo "   (You may be asked for authentication)"
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully pushed to GitHub!"
    echo ""
    echo "📍 Repository: https://github.com/sibasishmisra/classmate"
    echo ""
    echo "✅ Next steps:"
    echo "   1. Visit your repository on GitHub"
    echo "   2. Verify all files are there"
    echo "   3. Deploy to Vercel (see DEPLOYMENT.md)"
else
    echo ""
    echo "❌ Push failed"
    echo ""
    echo "💡 Common solutions:"
    echo "   1. If branch is 'master' instead of 'main':"
    echo "      git push -u origin master"
    echo ""
    echo "   2. If authentication failed:"
    echo "      Use Personal Access Token instead of password"
    echo "      See: https://github.com/settings/tokens"
    echo ""
    echo "   3. If repository has existing content:"
    echo "      git pull origin main --allow-unrelated-histories"
    echo "      git push -u origin main"
    echo ""
    exit 1
fi

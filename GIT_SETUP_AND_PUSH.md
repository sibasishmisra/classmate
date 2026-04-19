# Git Setup and Push to GitHub

## 🚨 Important: Install Xcode Command Line Tools First

Before running git commands, you need to install Xcode Command Line Tools:

```bash
xcode-select --install
```

A dialog will appear - click "Install" and wait for it to complete (5-10 minutes).

---

## 📋 Step-by-Step Git Setup

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory (if not already there)
cd ~/Documents/GitHub/classmate

# Initialize git repository
git init

# Check status
git status
```

### Step 2: Add Remote Repository

```bash
# Add the GitHub repository as remote
git remote add origin https://github.com/sibasishmisra/classmate.git

# Verify remote was added
git remote -v
```

### Step 3: Stage All Files

```bash
# Add all files to staging
git add .

# Or add specific files/folders:
# git add app/ components/ lib/ public/ types/
# git add package.json package-lock.json next.config.ts
# git add README.md *.md

# Check what will be committed
git status
```

### Step 4: Create Commit

```bash
# Commit with a descriptive message
git commit -m "feat: Complete ClassMate.info implementation with full sound system

- Add Enter key submission for questions (Shift+Enter for new line)
- Implement all 4 sound effects (bell, page-turn, chalk-tap, success-chime)
- Add sounds to level selection, buttons, explanation completion, and follow-ups
- Create comprehensive FAQ section with help page
- Add Settings panel with sound/animation toggles
- Implement content safety filtering and rate limiting
- Complete responsive design and accessibility features
- Add comprehensive documentation and setup guides"
```

### Step 5: Push to GitHub

```bash
# Push to main branch
git push -u origin main

# If the branch is named 'master' instead:
# git push -u origin master
```

---

## 🔐 Authentication

GitHub may ask for authentication. You have two options:

### Option A: Personal Access Token (Recommended)

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "ClassMate Development"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When git asks for password, paste the token

### Option B: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Then use SSH URL instead:
git remote set-url origin git@github.com:sibasishmisra/classmate.git
```

---

## 📦 What Will Be Committed

### Core Application Files:
- `app/` - Next.js pages and API routes
- `components/` - React components
- `lib/` - Utility functions and helpers
- `contexts/` - React context providers
- `types/` - TypeScript type definitions
- `public/` - Static assets (textures, sounds)

### Configuration Files:
- `package.json` - Dependencies
- `package-lock.json` - Locked dependencies
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration

### Documentation:
- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `FAQ_AND_SETTINGS_SUMMARY.md` - FAQ documentation
- `SOUND_IMPLEMENTATION_COMPLETE.md` - Sound system docs
- `SOUND_LOCATIONS_GUIDE.md` - Sound locations
- `SOUND_TEST_GUIDE.md` - Testing guide
- `ENTER_KEY_AND_SOUNDS_SUMMARY.md` - Feature summary
- And many more...

### Environment Files (NOT committed):
- `.env.local` - Your API keys (in .gitignore)
- `.env.docker` - Docker environment
- `node_modules/` - Dependencies (in .gitignore)
- `.next/` - Build output (in .gitignore)

---

## 🔍 Verify Before Pushing

```bash
# Check what files will be committed
git status

# See the changes
git diff --cached

# Check .gitignore is working
cat .gitignore

# Make sure .env.local is NOT staged
git status | grep .env.local
# Should show nothing (file is ignored)
```

---

## 🚀 Quick Commands (After Xcode Tools Installed)

```bash
# One-liner to setup and push
git init && \
git remote add origin https://github.com/sibasishmisra/classmate.git && \
git add . && \
git commit -m "feat: Complete ClassMate.info implementation with full sound system" && \
git push -u origin main
```

---

## 🐛 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/sibasishmisra/classmate.git
```

### Error: "failed to push some refs"
```bash
# Pull first if repository has existing content
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: "Authentication failed"
- Use Personal Access Token instead of password
- Or setup SSH key (see above)

### Error: "xcode-select: note: No developer tools"
```bash
# Install Xcode Command Line Tools
xcode-select --install
# Wait for installation to complete, then try again
```

---

## 📝 .gitignore Check

Make sure your `.gitignore` includes:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## ✅ Success Checklist

After pushing, verify on GitHub:

- [ ] Go to https://github.com/sibasishmisra/classmate
- [ ] See all your files in the repository
- [ ] Check README.md displays correctly
- [ ] Verify .env.local is NOT visible (should be ignored)
- [ ] Check sound files are in public/sounds/
- [ ] Verify all documentation files are present

---

## 🎉 Next Steps After Push

1. **Enable GitHub Pages** (optional)
   - Settings → Pages → Source: main branch

2. **Add Repository Description**
   - Add description: "AI-powered educational explanations with nostalgic school-themed interface"
   - Add topics: `nextjs`, `typescript`, `ai`, `education`, `claude-api`

3. **Deploy to Vercel**
   - See DEPLOYMENT.md for instructions
   - Or run: `vercel --prod`

4. **Share Your Project**
   - Repository URL: https://github.com/sibasishmisra/classmate
   - Live demo (after deployment): Your Vercel URL

---

**Need Help?** 
- GitHub Docs: https://docs.github.com/en/get-started
- Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics

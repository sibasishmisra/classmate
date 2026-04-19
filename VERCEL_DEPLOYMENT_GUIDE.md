# 🚀 Vercel Deployment Guide for ClassMate.info

## ✅ Git Repository Status
- **Repository:** https://github.com/sibasishmisra/classmate.git
- **Branch:** main
- **Status:** ✅ Pushed successfully
- **Commit:** feat: Migrate to Anthropic SDK with Claude Sonnet 4

## 📋 Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com/
   - Sign in with your GitHub account

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose: `sibasishmisra/classmate`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   ```
   
   **Note:** Use your actual Claude API key from `.env.local` file
   
   **⚠️ IMPORTANT:** Make sure to add this for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://classmate-[random].vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

When prompted:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **classmate**
- In which directory is your code located? **./`**
- Want to override the settings? **N**

Then add environment variable:
```bash
vercel env add CLAUDE_API_KEY
```
Paste your API key when prompted.

## 🔧 Environment Variables Required

| Variable | Value | Required |
|----------|-------|----------|
| `CLAUDE_API_KEY` | Your Anthropic API key | ✅ Yes |

**Optional variables** (have defaults):
- `NEXT_PUBLIC_MAX_TOPIC_LENGTH` - Default: 500
- `NEXT_PUBLIC_MAX_HISTORY_ENTRIES` - Default: 10
- `RATE_LIMIT_REQUESTS` - Default: 10
- `RATE_LIMIT_WINDOW_MS` - Default: 60000

## 📊 Build Configuration

Vercel will automatically detect these settings from your project:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## ✅ Post-Deployment Checklist

After deployment completes:

1. **Test the Application:**
   - Visit your Vercel URL
   - Select a learning level
   - Enter a topic (e.g., "photosynthesis")
   - Verify explanation appears
   - Test follow-up questions

2. **Check API Functionality:**
   - Visit: `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"ok"}`

3. **Monitor Logs:**
   - Go to Vercel Dashboard → Your Project → Logs
   - Check for any errors

4. **Verify Environment Variables:**
   - Go to Settings → Environment Variables
   - Ensure `CLAUDE_API_KEY` is set for all environments

## 🎯 Custom Domain (Optional)

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `classmate.info`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Errors
- Verify `CLAUDE_API_KEY` is set correctly
- Check API key is valid in Anthropic Console
- Review function logs in Vercel Dashboard

### 500 Errors
- Check Vercel function logs
- Verify environment variables are set
- Test API endpoints individually

## 📱 Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request
- **Development:** Can be tested locally

## 🔐 Security Notes

✅ **What's Protected:**
- `.env.local` is NOT in Git (excluded by .gitignore)
- API key is only in Vercel environment variables
- No sensitive data in repository

⚠️ **Important:**
- Never commit `.env.local` to Git
- Rotate API key if accidentally exposed
- Use Vercel's environment variables for secrets

## 📈 Monitoring

After deployment, monitor:
- **Vercel Analytics:** Built-in traffic analytics
- **Function Logs:** Real-time API logs
- **Anthropic Console:** API usage and costs

## 🎉 Success!

Once deployed, your ClassMate.info application will be:
- ✅ Live on the internet
- ✅ Using Claude Sonnet 4 AI model
- ✅ Automatically deployed on every Git push
- ✅ Scalable and fast with Vercel's CDN
- ✅ HTTPS enabled by default

## 🔗 Useful Links

- **Your Repository:** https://github.com/sibasishmisra/classmate
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Anthropic Console:** https://console.anthropic.com/
- **Next.js Docs:** https://nextjs.org/docs

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Next.js Discord: https://nextjs.org/discord
- Anthropic Support: https://support.anthropic.com/

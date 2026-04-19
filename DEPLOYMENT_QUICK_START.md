# ClassMate.info - Quick Deployment Guide

Fast-track deployment guide for ClassMate.info. For comprehensive documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Claude API key from [Anthropic Console](https://console.anthropic.com/)
- [ ] Code pushed to Git repository
- [ ] Production build tested locally

## Quick Deploy to Vercel (5 minutes)

**Fastest way to deploy ClassMate.info:**

1. **Get Claude API Key**
   - Visit https://console.anthropic.com/
   - Create API key (starts with `sk-ant-`)

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - Add environment variable:
     - Name: `CLAUDE_API_KEY`
     - Value: `sk-ant-api03-your-key-here`
   - Click "Deploy"

3. **Verify Deployment**
   - Visit `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"healthy","claudeApiStatus":"connected"}`

**Done! Your app is live.** 🎉

## Quick Deploy via CLI

### Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add API key
vercel env add CLAUDE_API_KEY production
# Paste your key when prompted

# Redeploy with env vars
vercel --prod
```

### Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Add API key
netlify env:set CLAUDE_API_KEY "sk-ant-api03-your-key-here"

# Deploy
netlify deploy --prod
```

## Environment Variables

**Required:**
```env
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

**Optional (with defaults):**
```env
NEXT_PUBLIC_APP_NAME=ClassMate.info
NEXT_PUBLIC_MAX_TOPIC_LENGTH=500
NEXT_PUBLIC_MAX_HISTORY_ENTRIES=10
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

## Local Testing Before Deploy

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API key to .env.local
# CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Build and test
npm run build
npm run start

# Visit http://localhost:3000
# Test the complete flow
```

## Post-Deployment Checklist

- [ ] Health check returns "healthy": `/api/health`
- [ ] Level selection works
- [ ] Topic submission generates explanations
- [ ] Follow-up questions work
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

## Common Issues

### "CLAUDE_API_KEY not configured"
- Add environment variable in deployment platform
- Redeploy after adding variables
- Check variable name is exactly `CLAUDE_API_KEY`

### Build fails
- Run `npm run build` locally first
- Check Node.js version is 18+
- Clear cache: `rm -rf .next node_modules && npm install`

### Slow performance
- Enable CDN on deployment platform
- Check Claude API response times
- Monitor with Lighthouse: `lighthouse https://your-domain.com`

## Platform Comparison

| Feature | Vercel | Netlify | Docker | Self-Hosted |
|---------|--------|---------|--------|-------------|
| Setup Time | 5 min | 5 min | 15 min | 30+ min |
| Difficulty | Easy | Easy | Medium | Hard |
| Auto HTTPS | ✅ | ✅ | ❌ | ❌ |
| Auto Deploy | ✅ | ✅ | ❌ | ❌ |
| Free Tier | ✅ | ✅ | N/A | N/A |
| Best For | Production | Production | Containers | Full Control |

## Need Help?

- **Full Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Setup Guide**: [SETUP.md](./SETUP.md)
- **Environment Config**: [.env.example](./.env.example)
- **Issues**: [GitHub Issues](https://github.com/your-username/classmate-info/issues)

## Security Reminders

- ⚠️ Never commit `.env.local` to Git
- ⚠️ Keep `CLAUDE_API_KEY` secret (no `NEXT_PUBLIC_` prefix)
- ⚠️ Rotate API key if exposed
- ⚠️ Enable HTTPS in production
- ⚠️ Monitor API usage and costs

---

**Ready to deploy?** Choose your platform above and follow the steps. For detailed instructions, troubleshooting, and advanced configuration, see the [full deployment guide](./DEPLOYMENT.md).

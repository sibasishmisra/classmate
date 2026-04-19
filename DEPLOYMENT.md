# ClassMate.info Deployment Guide

Complete guide for deploying ClassMate.info to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [API Key Configuration](#api-key-configuration)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [Docker](#docker)
  - [Self-Hosted](#self-hosted)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)
- [Security Checklist](#security-checklist)

---

## Prerequisites

Before deploying ClassMate.info, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Claude API key from Anthropic ([Get one here](https://console.anthropic.com/))
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Account on your chosen deployment platform
- ✅ Production build tested locally

### Local Build Verification

Test the production build locally before deploying:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Start production server
npm run start
```

Visit `http://localhost:3000` and verify:
- ✅ Application loads without errors
- ✅ Level selection works
- ✅ Topic submission generates explanations
- ✅ Follow-up questions function correctly
- ✅ No console errors

---

## Environment Setup

### Required Environment Variables

ClassMate.info requires the following environment variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `CLAUDE_API_KEY` | **Yes** | Anthropic Claude API key (server-side only) | `sk-ant-api03-...` |
| `NEXT_PUBLIC_APP_NAME` | No | Application name | `ClassMate.info` |
| `NEXT_PUBLIC_MAX_TOPIC_LENGTH` | No | Maximum topic length in characters | `500` |
| `NEXT_PUBLIC_MAX_HISTORY_ENTRIES` | No | Maximum session history entries | `10` |
| `RATE_LIMIT_REQUESTS` | No | API requests per time window | `10` |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in milliseconds | `60000` |

### Environment Variable Security

**CRITICAL SECURITY NOTES:**

1. **Never commit `.env.local` to version control** - It's already in `.gitignore`
2. **`CLAUDE_API_KEY` must NOT have `NEXT_PUBLIC_` prefix** - This keeps it server-side only
3. **Only variables with `NEXT_PUBLIC_` prefix are exposed to the browser** - Safe for client-side use
4. **Rotate API keys immediately if exposed** - Generate new key at [Anthropic Console](https://console.anthropic.com/)

### Default Values

If optional variables are not set, the application uses these defaults:

```env
NEXT_PUBLIC_APP_NAME=ClassMate.info
NEXT_PUBLIC_MAX_TOPIC_LENGTH=500
NEXT_PUBLIC_MAX_HISTORY_ENTRIES=10
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

---

## API Key Configuration

### Getting Your Claude API Key

1. **Visit Anthropic Console**: [https://console.anthropic.com/](https://console.anthropic.com/)
2. **Sign up or log in** to your Anthropic account
3. **Navigate to API Keys** section in the dashboard
4. **Create a new API key** or copy an existing one
5. **Copy the key** - It starts with `sk-ant-api03-...`

### API Key Format

Valid Claude API keys follow this format:
```
sk-ant-api03-[base64-encoded-string]
```

Example (not a real key):
```
sk-ant-api03-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

### Testing API Key Locally

Before deploying, test your API key locally:

1. Create `.env.local` from the example:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit the health check endpoint:
   ```
   http://localhost:3000/api/health
   ```

5. Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "claudeApiStatus": "connected"
   }
   ```

### API Key Troubleshooting

**Error: "CLAUDE_API_KEY not configured"**
- Ensure `.env.local` exists in project root
- Verify the key is correctly copied (no extra spaces)
- Restart the development server after adding the key

**Error: "Invalid API key format"**
- Check that the key starts with `sk-ant-`
- Ensure no line breaks or special characters in the key
- Generate a new key if the format is incorrect

**Error: "Claude API authentication failed"**
- Verify the API key is active in Anthropic Console
- Check your Anthropic account has available credits
- Ensure the key hasn't been revoked or expired

---

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Why Vercel?

- ✅ Built by the creators of Next.js
- ✅ Zero-configuration deployment
- ✅ Automatic HTTPS and CDN
- ✅ Serverless functions for API routes
- ✅ Automatic preview deployments for PRs
- ✅ Built-in analytics and monitoring

#### Deployment Steps

**Option 1: Deploy via Vercel Dashboard (Easiest)**

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Visit [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your repository**
   - Select your Git provider
   - Choose the ClassMate.info repository
   - Click "Import"

5. **Configure project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Add environment variables**
   - Click "Environment Variables"
   - Add `CLAUDE_API_KEY` with your API key
   - Optionally add other variables (see table above)
   - Select "Production" environment

7. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Visit your deployed site at `your-project.vercel.app`

**Option 2: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to production**
   ```bash
   vercel --prod
   ```

4. **Add environment variables**
   ```bash
   vercel env add CLAUDE_API_KEY production
   ```
   - Paste your API key when prompted
   - Repeat for other environment variables

5. **Redeploy with new environment variables**
   ```bash
   vercel --prod
   ```

#### Vercel Environment Variables

Add these in the Vercel Dashboard under **Settings → Environment Variables**:

```env
# Required
CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Optional (with defaults)
NEXT_PUBLIC_APP_NAME=ClassMate.info
NEXT_PUBLIC_MAX_TOPIC_LENGTH=500
NEXT_PUBLIC_MAX_HISTORY_ENTRIES=10
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

#### Custom Domain Setup (Vercel)

1. Go to **Settings → Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `classmate.info`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

---

### Netlify

Netlify is another excellent platform for deploying Next.js applications.

#### Deployment Steps

**Option 1: Deploy via Netlify Dashboard**

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Visit [netlify.com](https://netlify.com)** and sign in

3. **Click "Add new site" → "Import an existing project"**

4. **Connect to Git provider**
   - Select your Git provider
   - Authorize Netlify
   - Choose the ClassMate.info repository

5. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions` (auto-detected)

6. **Add environment variables**
   - Click "Show advanced"
   - Click "New variable"
   - Add `CLAUDE_API_KEY` and other variables
   - Click "Deploy site"

7. **Wait for deployment**
   - Build takes 2-4 minutes
   - Visit your site at `your-site.netlify.app`

**Option 2: Deploy via Netlify CLI**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize site**
   ```bash
   netlify init
   ```

4. **Add environment variables**
   ```bash
   netlify env:set CLAUDE_API_KEY "sk-ant-api03-your-key-here"
   ```

5. **Deploy to production**
   ```bash
   netlify deploy --prod
   ```

#### Netlify Configuration File

Create `netlify.toml` in project root for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### Custom Domain Setup (Netlify)

1. Go to **Site settings → Domain management**
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic with Let's Encrypt)

---

### Docker

Deploy ClassMate.info using Docker for containerized environments.

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  classmate:
    build: .
    ports:
      - "3000:3000"
    environment:
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - NEXT_PUBLIC_APP_NAME=ClassMate.info
      - NEXT_PUBLIC_MAX_TOPIC_LENGTH=500
      - NEXT_PUBLIC_MAX_HISTORY_ENTRIES=10
      - RATE_LIMIT_REQUESTS=10
      - RATE_LIMIT_WINDOW_MS=60000
    restart: unless-stopped
```

#### Build and Run

```bash
# Build Docker image
docker build -t classmate-info .

# Run container
docker run -p 3000:3000 \
  -e CLAUDE_API_KEY=sk-ant-api03-your-key-here \
  classmate-info

# Or use Docker Compose
docker-compose up -d
```

---

### Self-Hosted

Deploy on your own server (VPS, dedicated server, etc.).

#### Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)
- PM2 or similar process manager

#### Deployment Steps

1. **SSH into your server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone repository**
   ```bash
   git clone https://github.com/your-username/classmate-info.git
   cd classmate-info
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create environment file**
   ```bash
   nano .env.local
   ```
   Add your environment variables:
   ```env
   CLAUDE_API_KEY=sk-ant-api03-your-key-here
   NEXT_PUBLIC_APP_NAME=ClassMate.info
   NEXT_PUBLIC_MAX_TOPIC_LENGTH=500
   NEXT_PUBLIC_MAX_HISTORY_ENTRIES=10
   RATE_LIMIT_REQUESTS=10
   RATE_LIMIT_WINDOW_MS=60000
   ```

6. **Build application**
   ```bash
   npm run build
   ```

7. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

8. **Start application with PM2**
   ```bash
   pm2 start npm --name "classmate" -- start
   pm2 save
   pm2 startup
   ```

9. **Configure Nginx reverse proxy**
   ```bash
   sudo nano /etc/nginx/sites-available/classmate
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name classmate.info www.classmate.info;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Enable site and restart Nginx**
    ```bash
    sudo ln -s /etc/nginx/sites-available/classmate /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Install SSL certificate**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d classmate.info -d www.classmate.info
    ```

---

## Post-Deployment Verification

After deploying, verify everything works correctly:

### 1. Health Check

Visit your health check endpoint:
```
https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "claudeApiStatus": "connected"
}
```

### 2. Functional Testing

Test the complete user flow:

1. ✅ **Load homepage** - Should display level selector
2. ✅ **Select learning level** - Should show topic input
3. ✅ **Enter topic** - Character counter should update
4. ✅ **Submit topic** - Should show loading state
5. ✅ **View explanation** - Should display AI-generated content
6. ✅ **Click follow-up question** - Should show answer
7. ✅ **Check session history** - Should store topics

### 3. Performance Testing

Use Lighthouse or similar tools:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### 4. Mobile Testing

Test on actual mobile devices:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Responsive design (320px - 2560px)
- ✅ Touch interactions work
- ✅ Text is readable (minimum 16px)

### 5. Error Handling

Test error scenarios:
- ✅ Invalid API key (should show friendly error)
- ✅ Network timeout (should show retry option)
- ✅ Rate limit exceeded (should show wait message)
- ✅ Empty topic submission (should show validation error)

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "CLAUDE_API_KEY not configured"

**Symptoms:**
- Health check returns error
- Explanations fail to generate
- Console shows API key error

**Solutions:**
1. Verify environment variable is set in deployment platform
2. Check variable name is exactly `CLAUDE_API_KEY` (case-sensitive)
3. Ensure no extra spaces or line breaks in the key
4. Redeploy after adding environment variables

#### Issue: "Rate limit exceeded"

**Symptoms:**
- 429 status code on API requests
- "Classroom is full" error message

**Solutions:**
1. Increase `RATE_LIMIT_REQUESTS` environment variable
2. Increase `RATE_LIMIT_WINDOW_MS` for longer time window
3. Implement caching for repeated requests
4. Consider upgrading Claude API plan

#### Issue: Build fails

**Symptoms:**
- Deployment fails during build step
- TypeScript compilation errors
- Missing dependencies

**Solutions:**
1. Run `npm run build` locally to reproduce
2. Check Node.js version (must be 18+)
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
4. Verify all dependencies in package.json
5. Check for TypeScript errors: `npm run type-check`

#### Issue: Slow performance

**Symptoms:**
- Long load times
- Slow API responses
- Poor Lighthouse scores

**Solutions:**
1. Enable CDN on deployment platform
2. Optimize images and assets
3. Check Claude API response times
4. Monitor server resources (CPU, memory)
5. Implement caching strategies

#### Issue: CORS errors

**Symptoms:**
- API calls fail from browser
- Console shows CORS policy errors

**Solutions:**
1. Ensure API routes are on same domain
2. Check Next.js API route configuration
3. Verify no client-side direct calls to Claude API
4. All Claude calls should go through `/api/*` routes

---

## Security Checklist

Before going live, verify these security measures:

### Environment Variables
- [ ] `CLAUDE_API_KEY` is set and kept secret
- [ ] No API keys in client-side code
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables use correct prefixes (`NEXT_PUBLIC_` only for safe values)

### API Security
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] Input sanitization prevents XSS
- [ ] API routes are server-side only
- [ ] Error messages don't expose sensitive data

### HTTPS and Headers
- [ ] HTTPS is enabled (SSL certificate)
- [ ] Security headers are configured:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` (if applicable)

### Content Safety
- [ ] Content validation is active
- [ ] Inappropriate content filtering works
- [ ] Age-appropriate error messages
- [ ] No PII collection or storage

### Monitoring
- [ ] Error logging is configured
- [ ] API usage monitoring is active
- [ ] Performance monitoring is set up
- [ ] Alerts for critical errors

### Backup and Recovery
- [ ] Database backups (if applicable)
- [ ] Environment variable backups
- [ ] Deployment rollback plan
- [ ] Disaster recovery procedure

---

## Additional Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Anthropic Claude API](https://docs.anthropic.com/)

### Support
- **Project Issues**: [GitHub Issues](https://github.com/your-username/classmate-info/issues)
- **Anthropic Support**: [support@anthropic.com](mailto:support@anthropic.com)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Netlify Support**: [netlify.com/support](https://netlify.com/support)

### Monitoring Tools
- [Vercel Analytics](https://vercel.com/analytics)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay

---

## Conclusion

ClassMate.info is now ready for production deployment! Follow this guide for your chosen platform, and don't forget to:

1. ✅ Test locally before deploying
2. ✅ Secure your API keys
3. ✅ Verify post-deployment
4. ✅ Monitor performance and errors
5. ✅ Keep dependencies updated

For questions or issues, refer to the [Troubleshooting](#troubleshooting) section or open an issue on GitHub.

**Happy deploying! 🚀**

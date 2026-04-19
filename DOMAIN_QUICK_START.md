# 🚀 Quick Start: Connect classmate.info to Vercel

**Time:** 10 minutes | **Difficulty:** Easy

---

## Step 1: Vercel (2 minutes)

1. Go to: https://vercel.com/dashboard
2. Click your **classmate** project
3. Click **Settings** → **Domains**
4. Add domain: `classmate.info` → Click "Add"
5. Add domain: `www.classmate.info` → Click "Add"
6. **COPY** the DNS records shown (you'll need them next!)

**You'll see something like:**
```
A Record:    @ → 76.76.21.21
CNAME Record: www → cname.vercel-dns.com
```

---

## Step 2: GoDaddy (5 minutes)

1. Go to: https://www.godaddy.com/
2. Sign in → **My Products**
3. Find **classmate.info** → Click **DNS**
4. Scroll to **DNS Records** section

### Add/Edit A Record:
- Type: **A**
- Name: **@**
- Value: **76.76.21.21** (or IP from Vercel)
- Click **Save**

### Add/Edit CNAME Record:
- Type: **CNAME**
- Name: **www**
- Value: **cname.vercel-dns.com**
- Click **Save**

### Delete These (if they exist):
- ❌ Old A records pointing to GoDaddy
- ❌ Old CNAME records for @
- ❌ Parking page records

---

## Step 3: Wait & Verify (10-30 minutes)

1. **Wait** 10-30 minutes for DNS to propagate
2. **Visit:** https://classmate.info
3. **Should see:** Your ClassMate app! 🎉
4. **Check:** Browser shows padlock 🔒 (SSL working)

---

## ✅ Done!

Your app is now live at:
- **https://classmate.info**
- **https://www.classmate.info**

Both URLs will work and show your app!

---

## 🆘 Not Working?

**Check these:**
- [ ] Waited at least 10 minutes?
- [ ] A record in GoDaddy: @ → Vercel IP
- [ ] CNAME record in GoDaddy: www → cname.vercel-dns.com
- [ ] Deleted old/conflicting DNS records?
- [ ] Vercel shows green checkmarks?

**Still stuck?** See full guide: `CUSTOM_DOMAIN_SETUP.md`

---

## 🎯 Quick Test

```bash
# Check DNS (after 10 minutes)
nslookup classmate.info

# Should show Vercel's IP address
```

Or visit: https://dnschecker.org/ and enter `classmate.info`

---

**That's it! Your custom domain is ready! 🚀**

# 🌐 Custom Domain Setup Guide
## Connecting classmate.info (GoDaddy) to Vercel

---

## 📋 Overview

You'll connect your GoDaddy domain **classmate.info** to your Vercel deployment in two main steps:
1. **Add domain in Vercel** (get DNS records)
2. **Configure DNS in GoDaddy** (point domain to Vercel)

**Time Required:** 5-10 minutes (+ 5-30 minutes for DNS propagation)

---

## Part 1: Add Domain in Vercel (5 minutes)

### Step 1: Go to Your Vercel Project

1. **Open:** https://vercel.com/dashboard
2. **Click** on your **classmate** project
3. **Click** the **"Settings"** tab at the top

### Step 2: Add Your Domain

1. In Settings, click **"Domains"** in the left sidebar
2. You'll see a text box that says "Add Domain"
3. **Type:** `classmate.info`
4. **Click:** "Add"

### Step 3: Add www Subdomain (Recommended)

1. **Type:** `www.classmate.info`
2. **Click:** "Add"
3. This allows both `classmate.info` and `www.classmate.info` to work

### Step 4: Get DNS Records from Vercel

After adding the domains, Vercel will show you DNS records to configure. You'll see something like:

**For classmate.info (root domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.classmate.info:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**📝 IMPORTANT:** Keep this Vercel page open! You'll need these values for GoDaddy.

---

## Part 2: Configure DNS in GoDaddy (5 minutes)

### Step 1: Log into GoDaddy

1. **Go to:** https://www.godaddy.com/
2. **Sign in** to your account
3. **Click** on your profile icon (top right)
4. **Select:** "My Products"

### Step 2: Access DNS Management

1. Find **classmate.info** in your domains list
2. **Click** the **"DNS"** button next to it
   - Or click the three dots ⋮ → "Manage DNS"

### Step 3: Configure A Record (Root Domain)

1. Scroll down to the **"DNS Records"** section
2. Look for existing **A** records with Name **@**
3. **Click** the pencil icon ✏️ to edit (or trash icon 🗑️ to delete old ones)

**Add/Edit A Record:**
- **Type:** A
- **Name:** @ (this means root domain)
- **Value:** `76.76.21.21` (Vercel's IP - copy from Vercel dashboard)
- **TTL:** 600 seconds (or leave default)
- **Click:** "Save"

### Step 4: Configure CNAME Record (www Subdomain)

1. Look for existing **CNAME** records with Name **www**
2. **Click** the pencil icon ✏️ to edit (or delete old ones)

**Add/Edit CNAME Record:**
- **Type:** CNAME
- **Name:** www
- **Value:** `cname.vercel-dns.com` (copy from Vercel dashboard)
- **TTL:** 600 seconds (or leave default)
- **Click:** "Save"

### Step 5: Remove Conflicting Records (Important!)

GoDaddy often adds default records that conflict. **Delete these if they exist:**

❌ **Delete:**
- Any A record pointing to GoDaddy's parking page
- Any CNAME record for @ (root)
- Any AAAA records (IPv6) that aren't from Vercel

✅ **Keep:**
- Your new A record (@) pointing to Vercel
- Your new CNAME record (www) pointing to Vercel
- Any MX records (for email)
- Any TXT records (for verification)

---

## Part 3: Verify in Vercel (2 minutes)

### Step 1: Return to Vercel

1. Go back to your Vercel project → Settings → Domains
2. You should see your domains with status indicators

### Step 2: Wait for Verification

Vercel will automatically check DNS configuration:

**Status Indicators:**
- 🟡 **Pending:** DNS not configured yet or propagating
- 🟢 **Valid:** Domain is working!
- 🔴 **Invalid:** DNS configuration error

### Step 3: Refresh Status

1. **Click** the refresh icon 🔄 next to each domain
2. If still pending, wait 5-10 minutes and refresh again

---

## 📊 Expected DNS Configuration

Here's what your GoDaddy DNS should look like when done:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 600 |
| CNAME | www | cname.vercel-dns.com | 600 |

**Note:** The A record IP might be different. Always use the IP shown in your Vercel dashboard!

---

## ⏱️ DNS Propagation Time

After configuring DNS in GoDaddy:

- **Minimum:** 5 minutes
- **Typical:** 10-30 minutes
- **Maximum:** 48 hours (rare)

**During propagation:**
- Some users might see the old site
- Some users might see the new site
- This is normal!

---

## ✅ Verification Checklist

### Test Your Domain

After DNS propagates, test these URLs:

1. **http://classmate.info** → Should redirect to https://classmate.info
2. **https://classmate.info** → Should show your app
3. **http://www.classmate.info** → Should redirect to https://www.classmate.info
4. **https://www.classmate.info** → Should show your app

### Check SSL Certificate

Vercel automatically provisions SSL certificates:

1. Visit https://classmate.info
2. Click the padlock 🔒 icon in browser address bar
3. Should show "Connection is secure"
4. Certificate should be issued by "Let's Encrypt" or "Vercel"

**SSL Provisioning Time:** 1-5 minutes after DNS is verified

---

## 🔧 Troubleshooting

### Issue 1: "Invalid Configuration" in Vercel

**Cause:** DNS records not set correctly in GoDaddy

**Fix:**
1. Double-check A and CNAME records in GoDaddy
2. Make sure values match exactly what Vercel shows
3. Remove any conflicting records
4. Wait 10 minutes and refresh in Vercel

### Issue 2: Domain Shows GoDaddy Parking Page

**Cause:** A record still pointing to GoDaddy

**Fix:**
1. Go to GoDaddy DNS settings
2. Find the A record with Name @
3. Change Value to Vercel's IP (76.76.21.21 or as shown in Vercel)
4. Save and wait 10 minutes

### Issue 3: www Works but Root Domain Doesn't (or vice versa)

**Cause:** One DNS record is correct, the other isn't

**Fix:**
1. Check both A record (@) and CNAME record (www) in GoDaddy
2. Make sure both are configured as shown above
3. Refresh both domains in Vercel

### Issue 4: "Too Many Redirects" Error

**Cause:** Conflicting redirect rules

**Fix:**
1. In Vercel, go to Settings → Domains
2. Make sure only one domain is set as "Primary"
3. The other should redirect to the primary
4. Recommended: Set `classmate.info` as primary, `www.classmate.info` redirects to it

### Issue 5: SSL Certificate Error

**Cause:** SSL not provisioned yet

**Fix:**
1. Wait 5-10 minutes after DNS verification
2. Vercel automatically provisions SSL
3. Try accessing with https:// (not http://)
4. Clear browser cache and try again

---

## 🎯 Recommended Domain Configuration

### Option A: Root Domain as Primary (Recommended)

**Primary:** classmate.info  
**Redirect:** www.classmate.info → classmate.info

**In Vercel:**
1. Go to Settings → Domains
2. Click the three dots ⋮ next to `classmate.info`
3. Select "Set as Primary Domain"
4. `www.classmate.info` will automatically redirect

### Option B: www as Primary

**Primary:** www.classmate.info  
**Redirect:** classmate.info → www.classmate.info

**In Vercel:**
1. Go to Settings → Domains
2. Click the three dots ⋮ next to `www.classmate.info`
3. Select "Set as Primary Domain"
4. `classmate.info` will automatically redirect

**💡 Recommendation:** Use Option A (root domain as primary) - it's shorter and cleaner!

---

## 📱 Testing Tools

### Check DNS Propagation

Use these tools to check if DNS has propagated globally:

1. **DNS Checker:** https://dnschecker.org/
   - Enter: `classmate.info`
   - Type: A
   - Should show: 76.76.21.21 (or Vercel's IP)

2. **What's My DNS:** https://www.whatsmydns.net/
   - Enter: `classmate.info`
   - Should show Vercel's IP worldwide

### Check SSL Certificate

1. **SSL Labs:** https://www.ssllabs.com/ssltest/
   - Enter: `classmate.info`
   - Should get A or A+ rating

---

## 📋 Quick Reference Card

### Vercel Dashboard
```
Project → Settings → Domains
Add: classmate.info
Add: www.classmate.info
Copy DNS records shown
```

### GoDaddy DNS Settings
```
My Products → classmate.info → DNS

A Record:
  Name: @
  Value: [Vercel's IP from dashboard]
  
CNAME Record:
  Name: www
  Value: cname.vercel-dns.com
```

### Verification
```
Wait 10-30 minutes
Visit: https://classmate.info
Should see: Your ClassMate app
Check: SSL padlock 🔒 in browser
```

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Vercel shows green checkmarks ✓ next to both domains  
✅ https://classmate.info loads your app  
✅ https://www.classmate.info loads your app  
✅ Browser shows padlock 🔒 (SSL working)  
✅ No certificate warnings  
✅ Fast loading times  

---

## 📞 Support Resources

### Vercel Support
- **Docs:** https://vercel.com/docs/concepts/projects/domains
- **Support:** https://vercel.com/support

### GoDaddy Support
- **DNS Help:** https://www.godaddy.com/help/manage-dns-680
- **Support:** https://www.godaddy.com/contact-us

---

## 🚀 After Domain is Live

Once your domain is working:

1. **Update Links:** Change any links from vercel.app to classmate.info
2. **Share:** Share your new domain with users!
3. **Monitor:** Check Vercel Analytics for traffic
4. **SEO:** Submit to Google Search Console
5. **Social:** Update social media links

---

## 📝 Summary

**What You Need to Do:**

1. ✅ Add `classmate.info` and `www.classmate.info` in Vercel
2. ✅ Copy DNS records from Vercel
3. ✅ Add A record in GoDaddy (@ → Vercel IP)
4. ✅ Add CNAME record in GoDaddy (www → cname.vercel-dns.com)
5. ✅ Wait 10-30 minutes for DNS propagation
6. ✅ Verify domain works with https://
7. ✅ Check SSL certificate is active

**Total Time:** ~15-40 minutes (including DNS propagation)

---

## 🎊 Congratulations!

Once complete, your ClassMate.info app will be live at:
- **https://classmate.info** ← Your custom domain!
- **https://www.classmate.info** ← Also works!

Your Vercel deployment URL will still work but will redirect to your custom domain.

**Need help?** Check the troubleshooting section above or contact Vercel/GoDaddy support!

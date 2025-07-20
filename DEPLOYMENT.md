# 🚀 Deployment Guide - Startup Ecosystem

This guide will walk you through deploying the Startup Ecosystem application to GitHub, Vercel, and setting up a custom domain.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Custom domain (optional)
- Supabase project (already configured)

## 🔧 Step 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Repository name: `startup-ecosystem`
4. Description: `A comprehensive platform connecting startups, investors, and talent in India's startup ecosystem`
5. Make it **Public** (for free Vercel deployment)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### 1.2 Push Code to GitHub

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/startup-ecosystem.git

# Push the code
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Vercel Deployment

### 2.1 Connect to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `startup-ecosystem` repository
4. Configure the project settings:

### 2.2 Project Configuration

**Framework Preset:** Vite  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### 2.3 Environment Variables

Add these environment variables in Vercel:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Startup Ecosystem
VITE_APP_URL=https://your-domain.com
```

**To get your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

### 2.4 Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be available at `https://your-project.vercel.app`

## 🌍 Step 3: Custom Domain Setup

### 3.1 Domain Configuration in Vercel

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain (e.g., `startupecosystem.in`)
3. Vercel will provide DNS records to configure

### 3.2 DNS Configuration

Add these DNS records to your domain provider:

**For Apex Domain (startupecosystem.in):**
```
Type: A
Name: @
Value: 76.76.19.36
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3.3 SSL Certificate

Vercel automatically provides SSL certificates for custom domains. Wait 24-48 hours for the certificate to be issued.

## 🔒 Step 4: Security & Performance

### 4.1 Security Headers

Vercel automatically adds security headers, but you can customize them in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 4.2 Performance Optimization

1. **Image Optimization:** Use Vercel's built-in image optimization
2. **Caching:** Configure caching headers for static assets
3. **CDN:** Vercel provides global CDN automatically

## 📊 Step 5: Monitoring & Analytics

### 5.1 Vercel Analytics

1. Enable Vercel Analytics in your project settings
2. Add the analytics script to your app

### 5.2 Error Monitoring

Consider adding Sentry for error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

## 🔄 Step 6: Continuous Deployment

### 6.1 Automatic Deployments

Vercel automatically deploys when you push to the `main` branch.

### 6.2 Preview Deployments

Create feature branches for testing:
```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Vercel will create a preview deployment for each branch.

## 🧪 Step 7: Testing Deployment

### 7.1 Pre-deployment Checklist

- [ ] All environment variables are set
- [ ] Supabase project is configured
- [ ] Database schema is deployed
- [ ] Authentication is working
- [ ] All features are tested locally

### 7.2 Post-deployment Testing

1. **Authentication:** Test sign up/sign in
2. **Core Features:** Test opportunity posting, profiles, questionnaires
3. **Performance:** Check loading times
4. **Mobile:** Test responsive design
5. **SEO:** Check meta tags and structured data

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check environment variables
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **Authentication Issues:**
   - Verify Supabase URL and keys
   - Check CORS settings in Supabase
   - Ensure redirect URLs are configured

3. **Domain Issues:**
   - Wait 24-48 hours for DNS propagation
   - Verify DNS records are correct
   - Check SSL certificate status

### Getting Help

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **GitHub Issues:** Create issues in your repository

## 📈 Step 8: Post-Launch

### 8.1 Monitoring

- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics

### 8.2 Maintenance

- Regular dependency updates
- Security patches
- Performance optimizations

### 8.3 Scaling

- Monitor usage patterns
- Optimize database queries
- Consider caching strategies

## 🎉 Success!

Your Startup Ecosystem application is now live and ready to connect India's startup community!

**Next Steps:**
1. Share your domain with users
2. Monitor usage and feedback
3. Iterate and improve based on user needs
4. Consider adding more features like notifications, messaging, etc.

---

**Need Help?** Create an issue in your GitHub repository or reach out to the development team. 
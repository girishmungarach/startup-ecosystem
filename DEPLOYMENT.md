# Deployment Guide - StartupEcosystem.in

This guide will help you deploy StartupEcosystem.in to Vercel with Supabase integration.

## 🚀 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **GitHub Account**: For repository hosting

## 📋 Step-by-Step Deployment

### 1. Set Up Supabase

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `startupecosystem`
   - Set a database password
   - Choose a region (preferably close to your users)
   - Click "Create new project"

2. **Get your Supabase credentials**
   - Go to Settings → API
   - Copy your Project URL
   - Copy your `anon` public key

3. **Set up the database**
   - Go to SQL Editor
   - Run the SQL commands from the README.md file to create all tables and policies

### 2. Prepare Your Code

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - StartupEcosystem.in"
   git push origin main
   ```

2. **Create a `.env.local` file** (for local development)
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Deploy to Vercel

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

2. **Configure the project**
   - Framework Preset: `Vite`
   - Root Directory: `code` (since your app is in the code folder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### 4. Configure Custom Domain (Optional)

1. **Add custom domain**
   - Go to your project settings in Vercel
   - Click "Domains"
   - Add your domain (e.g., `startupecosystem.in`)

2. **Update Supabase Auth settings**
   - Go to Supabase Dashboard → Authentication → Settings
   - Add your domain to "Site URL"
   - Add your domain to "Redirect URLs"

## 🔧 Post-Deployment Configuration

### 1. Supabase Auth Configuration

1. **Update Auth settings**
   - Go to Supabase Dashboard → Authentication → Settings
   - Set Site URL to your Vercel domain
   - Add redirect URLs:
     - `https://your-domain.vercel.app/auth/callback`
     - `https://your-domain.vercel.app/signin`
     - `https://your-domain.vercel.app/signup`

2. **Configure Google OAuth (Optional)**
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 2. Email Configuration

1. **Set up email templates**
   - Go to Authentication → Email Templates
   - Customize confirmation and reset emails
   - Update branding to match your app

### 3. Database Functions (Optional)

Create these Supabase Edge Functions for enhanced functionality:

```sql
-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 🔍 Testing Your Deployment

1. **Test Authentication**
   - Visit your deployed site
   - Try signing up with email/password
   - Test Google OAuth (if configured)
   - Verify email confirmation works

2. **Test Core Features**
   - Create a profile
   - Post an opportunity
   - Browse opportunities
   - Test the grab functionality

3. **Test Responsive Design**
   - Test on mobile devices
   - Test on different screen sizes

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
- Enable Vercel Analytics in your project settings
- Monitor performance and user behavior

### 2. Supabase Monitoring
- Check Supabase Dashboard for database performance
- Monitor authentication logs
- Set up alerts for errors

### 3. Error Tracking
Consider adding error tracking:
```bash
npm install @sentry/react
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use Vercel's environment variable system
   - Rotate keys regularly

2. **Database Security**
   - Review RLS policies
   - Monitor database access logs
   - Set up backup schedules

3. **CORS Configuration**
   - Configure CORS in Supabase if needed
   - Restrict origins to your domain

## 🚀 Performance Optimization

1. **Enable Vercel Edge Functions**
   - Move API calls to Edge Functions for better performance
   - Use Supabase Edge Functions for complex operations

2. **Image Optimization**
   - Use Vercel's Image Optimization
   - Optimize images before upload

3. **Caching**
   - Implement proper caching strategies
   - Use Supabase's built-in caching

## 🔄 Continuous Deployment

1. **Set up automatic deployments**
   - Vercel automatically deploys on Git pushes
   - Set up preview deployments for pull requests

2. **Environment Management**
   - Use different Supabase projects for staging/production
   - Set up environment-specific variables

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run build`
   - Verify all dependencies are installed
   - Check environment variables

2. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs in Supabase
   - Test with different browsers

3. **Database Connection Issues**
   - Verify RLS policies
   - Check database permissions
   - Monitor Supabase logs

### Getting Help

- Check Vercel deployment logs
- Review Supabase dashboard for errors
- Check browser console for client-side errors
- Contact support if needed

## 📈 Next Steps

1. **Set up monitoring and analytics**
2. **Implement advanced features**
3. **Add more authentication providers**
4. **Optimize for performance**
5. **Set up automated testing**

---

**Your StartupEcosystem.in is now live! 🎉** 
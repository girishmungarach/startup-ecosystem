# 🚀 StartupEcosystem.in Setup Guide

## **Issue Identified: Navigation Problems Due to Missing Database Setup**

You're experiencing navigation issues because the Supabase database tables don't exist yet. This causes authentication and data operations to fail, breaking the user flow.

## **🔧 STEP-BY-STEP SETUP**

### **Step 1: Set Up Environment Variables**

1. **Create `.env` file** in the `code` directory:
```bash
# In the code directory, create a file named .env
```

2. **Add your Supabase credentials** to the `.env` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
```

3. **Get your Supabase credentials**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project or use existing one
   - Go to Settings → API
   - Copy the "Project URL" and "anon public" key

### **Step 2: Set Up Database Tables**

1. **Open Supabase Dashboard**:
   - Go to your project dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL setup**:
   - Copy the entire content from `supabase-setup.sql`
   - Paste it in the SQL Editor
   - Click "Run" to execute

3. **Verify setup**:
   - You should see "Database setup completed successfully! 🎉"
   - Check that tables are created in "Table Editor"

### **Step 3: Configure Authentication**

1. **Enable Email Auth**:
   - Go to Authentication → Settings
   - Enable "Email" provider
   - Configure email templates if needed

2. **Enable Google OAuth** (Optional):
   - Go to Authentication → Providers
   - Enable "Google"
   - Add your Google OAuth credentials

3. **Set up redirect URLs**:
   - Go to Authentication → Settings → URL Configuration
   - Add: `http://localhost:5173/auth/callback`
   - Add: `http://localhost:5173/` (for production)

### **Step 4: Test the Application**

1. **Start the development server**:
```bash
cd code
npm run dev
```

2. **Test the complete user journey**:
   - Open http://localhost:5173
   - Click "Jump In" → Sign Up → Create Profile → Browse Opportunities
   - All navigation should work smoothly now!

## **🔍 TROUBLESHOOTING**

### **Common Issues & Solutions**

#### **Issue 1: "Missing Supabase environment variables"**
**Solution**: Make sure your `.env` file exists and has the correct values

#### **Issue 2: "Authentication failed"**
**Solution**: 
- Check that email auth is enabled in Supabase
- Verify your API keys are correct
- Check browser console for specific errors

#### **Issue 3: "Database tables don't exist"**
**Solution**: Run the SQL setup script in Supabase SQL Editor

#### **Issue 4: "Navigation not working"**
**Solution**: 
- Check that authentication is working
- Verify protected routes are properly configured
- Check browser console for React Router errors

### **Debug Steps**

1. **Check browser console** for JavaScript errors
2. **Check network tab** for failed API requests
3. **Verify Supabase connection** in browser console:
```javascript
// In browser console, check if Supabase is connected
console.log(window.supabase)
```

4. **Test authentication manually**:
```javascript
// In browser console
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
})
console.log(data, error)
```

## **✅ VERIFICATION CHECKLIST**

- [ ] `.env` file created with correct Supabase credentials
- [ ] SQL setup script executed successfully
- [ ] Database tables created (profiles, opportunities, etc.)
- [ ] Authentication enabled in Supabase
- [ ] Development server running (`npm run dev`)
- [ ] Landing page loads without errors
- [ ] Sign up flow works end-to-end
- [ ] Profile creation works
- [ ] Opportunities dashboard loads
- [ ] Navigation between pages works
- [ ] "Grab It" button works
- [ ] All user journeys functional

## **🚀 NEXT STEPS AFTER SETUP**

1. **Test all user journeys** using the checklist in `USER_JOURNEYS.md`
2. **Deploy to Vercel** using the guide in `DEPLOYMENT.md`
3. **Configure production environment** variables in Vercel
4. **Set up custom domain** (optional)
5. **Configure email templates** in Supabase
6. **Set up monitoring and analytics**

## **📞 SUPPORT**

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Review browser console** for specific error messages
3. **Verify Supabase dashboard** settings
4. **Test with the verification checklist**

---

**Once you complete this setup, all navigation issues should be resolved! 🎉** 
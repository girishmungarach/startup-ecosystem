# StartupEcosystem.in

A privacy-first startup networking platform for India's startup ecosystem. Connect founders, investors, and startup talent through opportunity-based networking with consent-based contact sharing.

## 🚀 Features

### Core Functionality
- **Opportunity-Driven Networking**: All connections happen through specific opportunities (jobs, investments, partnerships)
- **Privacy-First Design**: No direct contact - contact details only shared after mutual interest
- **Consent-Based Sharing**: Optional questionnaire system for screening before contact sharing
- **Poster Control**: Opportunity posters decide whether to share contact directly or screen with questions first

### User Journeys
- **Opportunity Seeker**: Browse opportunities → Grab It → Complete questionnaire → Receive contact
- **Opportunity Poster**: Post opportunities → Review responses → Send questionnaire → Share contact
- **Profile Discovery**: Browse profiles → Bookmark → Manage connections

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel
- **State Management**: React Context + Supabase client

## 📁 Project Structure

```
src/
├── components/
│   └── generated/          # All existing UI components
├── contexts/              # React Context providers
│   └── AuthContext.tsx    # Authentication state management
├── layouts/               # Layout components
│   └── MainLayout.tsx     # Main app layout with navigation
├── pages/                 # Page components
│   ├── SignInPage.tsx     # Authentication pages
│   └── SignUpPage.tsx
├── services/              # API services
│   └── supabase.ts        # Supabase client and helpers
├── types/                 # TypeScript type definitions
│   └── database.ts        # Database schema types
└── utils/                 # Utility functions
```

## 🗄️ Database Schema

### Tables
- **profiles**: User profile information
- **opportunities**: Posted opportunities
- **opportunity_grabs**: User responses to opportunities
- **connections**: Established connections between users
- **bookmarks**: Saved profiles with tags

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd startupecosystem/code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Run the following SQL in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     full_name TEXT,
     email TEXT,
     company TEXT,
     role TEXT,
     interests TEXT[],
     building TEXT,
     opportunities TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create opportunities table
   CREATE TABLE opportunities (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id),
     title TEXT NOT NULL,
     type TEXT NOT NULL,
     location TEXT,
     description TEXT NOT NULL,
     requirements TEXT,
     compensation TEXT,
     contact_preference TEXT NOT NULL,
     screening_questions JSONB,
     status TEXT DEFAULT 'active',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create opportunity_grabs table
   CREATE TABLE opportunity_grabs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     opportunity_id UUID REFERENCES opportunities(id),
     user_id UUID REFERENCES profiles(id),
     status TEXT DEFAULT 'pending',
     questionnaire_responses JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create connections table
   CREATE TABLE connections (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     requester_id UUID REFERENCES profiles(id),
     responder_id UUID REFERENCES profiles(id),
     opportunity_id UUID REFERENCES opportunities(id),
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create bookmarks table
   CREATE TABLE bookmarks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id),
     profile_id UUID REFERENCES profiles(id),
     tags TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
   ALTER TABLE opportunity_grabs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

   -- Create RLS policies
   CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can view all opportunities" ON opportunities FOR SELECT USING (true);
   CREATE POLICY "Users can create opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view opportunity grabs" ON opportunity_grabs FOR SELECT USING (true);
   CREATE POLICY "Users can create opportunity grabs" ON opportunity_grabs FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own opportunity grabs" ON opportunity_grabs FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view connections" ON connections FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = responder_id);
   CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (auth.uid() = requester_id);

   CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Authentication

The app uses Supabase Auth with support for:
- Email/password authentication
- Google OAuth
- Session management
- Protected routes

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/signin` - Sign in page
- `/signup` - Sign up page

### Protected Routes
- `/opportunities` - Browse opportunities
- `/opportunities/post` - Post new opportunity
- `/my-opportunities` - Manage posted opportunities
- `/profiles` - Browse user profiles
- `/profiles/:id` - View specific profile
- `/connections` - Manage connections
- `/bookmarks` - Manage bookmarks
- `/profile/create` - Create user profile

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables

Make sure to set these in your deployment environment:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@startupecosystem.in or create an issue in the repository.

---

**Built with ❤️ for India's startup ecosystem**
#   F o r c e   n e w   d e p l o y m e n t  
 
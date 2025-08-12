-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  avatar_url TEXT,
  user_type VARCHAR CHECK (user_type IN ('viewer', 'filmmaker', 'admin')) DEFAULT 'viewer',
  subscription_status VARCHAR DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Filmmaker profiles
CREATE TABLE public.filmmaker_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  portfolio_url TEXT,
  social_links JSONB DEFAULT '{}',
  verification_status VARCHAR DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  revenue_share DECIMAL DEFAULT 0.90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Films table
CREATE TABLE public.films (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filmmaker_id UUID REFERENCES public.filmmaker_profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  genre VARCHAR[] DEFAULT '{}',
  duration INTEGER, -- in minutes
  release_date DATE,
  poster_url TEXT,
  trailer_url TEXT,
  film_url TEXT,
  rental_price DECIMAL DEFAULT 0,
  purchase_price DECIMAL DEFAULT 0,
  status VARCHAR CHECK (status IN ('draft', 'review', 'published', 'archived')) DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE,
  transaction_type VARCHAR CHECK (transaction_type IN ('rental', 'purchase', 'subscription')) NOT NULL,
  amount DECIMAL NOT NULL,
  currency VARCHAR DEFAULT 'USD',
  payment_method VARCHAR,
  payment_provider VARCHAR,
  provider_transaction_id VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  expires_at TIMESTAMP WITH TIME ZONE, -- for rentals
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User film access table
CREATE TABLE public.user_film_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE,
  access_type VARCHAR CHECK (access_type IN ('rental', 'purchase', 'subscription')) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Film views analytics
CREATE TABLE public.film_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  film_id UUID REFERENCES public.films(id) ON DELETE CASCADE,
  watch_duration INTEGER DEFAULT 0, -- seconds watched
  completion_percentage DECIMAL DEFAULT 0,
  device_info JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job postings
CREATE TABLE public.job_postings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poster_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  job_type VARCHAR,
  budget_range VARCHAR,
  location VARCHAR,
  requirements TEXT[] DEFAULT '{}',
  status VARCHAR DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Co-production projects
CREATE TABLE public.coproduction_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.filmmaker_profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  budget_needed DECIMAL,
  equity_offered DECIMAL,
  status VARCHAR DEFAULT 'seeking_partners' CHECK (status IN ('seeking_partners', 'in_production', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filmmaker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_film_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coproduction_projects ENABLE ROW LEVEL SECURITY;

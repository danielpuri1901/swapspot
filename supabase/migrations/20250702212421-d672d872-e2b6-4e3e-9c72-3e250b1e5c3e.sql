-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  university TEXT,
  exchange_university TEXT,
  program TEXT,
  start_date DATE,
  end_date DATE,
  current_location TEXT,
  current_address TEXT,
  budget TEXT,
  preferred_destinations TEXT[],
  apartment_description TEXT,
  verification_method TEXT CHECK (verification_method IN ('email', 'id')),
  university_email TEXT,
  additional_info TEXT,
  has_uploaded_proof BOOLEAN DEFAULT FALSE,
  gdpr_consent BOOLEAN DEFAULT FALSE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  nationality TEXT,
  languages_spoken TEXT[],
  interests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow profile creation" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Create subscription tier enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'premium', 'elite');

-- Create subscribers table
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN DEFAULT FALSE,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers
CREATE POLICY "select_own_subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "insert_subscription" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "update_own_subscription" 
  ON public.subscribers 
  FOR UPDATE 
  USING (true);

-- Create premium features table
CREATE TABLE public.premium_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL,
  swap_id TEXT,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on premium features
ALTER TABLE public.premium_features ENABLE ROW LEVEL SECURITY;

-- Create policies for premium features
CREATE POLICY "select_own_premium_features" 
  ON public.premium_features 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "insert_premium_features" 
  ON public.premium_features 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat rooms
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for chat rooms
CREATE POLICY "Anyone can view chat rooms" 
  ON public.chat_rooms 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create chat rooms" 
  ON public.chat_rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Anyone can view messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can send messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
  ON public.chat_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
  ON public.chat_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  university TEXT,
  major TEXT,
  city TEXT,
  start_date DATE,
  end_date DATE,
  min_rent INTEGER,
  max_rent INTEGER,
  wants_flatmate BOOLEAN,
  smoker BOOLEAN,
  pets BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, gdpr_consent)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'gdpr_consent')::boolean, false)
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update chat room member count
CREATE OR REPLACE FUNCTION public.update_chat_room_member_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chat_rooms 
    SET member_count = (
      SELECT COUNT(DISTINCT user_id) 
      FROM chat_messages 
      WHERE chat_room_id = NEW.chat_room_id 
      AND user_id IS NOT NULL
    )
    WHERE id = NEW.chat_room_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for member count
CREATE TRIGGER update_member_count_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_room_member_count();

-- Create storage bucket for accommodation photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('accommodation-photos', 'accommodation-photos', true);

-- Create storage policies
CREATE POLICY "Anyone can view accommodation photos" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'accommodation-photos');

CREATE POLICY "Anyone can upload accommodation photos" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'accommodation-photos');

CREATE POLICY "Users can update their own accommodation photos" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'accommodation-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own accommodation photos" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'accommodation-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default chat rooms
INSERT INTO public.chat_rooms (city, country, description) VALUES
('Paris', 'France', 'Connect with students heading to Paris for exchange'),
('London', 'UK', 'Chat with fellow students going to London'),
('Barcelona', 'Spain', 'Meet other students planning their Barcelona exchange'),
('Amsterdam', 'Netherlands', 'Connect with students going to Amsterdam'),
('Rome', 'Italy', 'Chat with students heading to the Eternal City'),
('Berlin', 'Germany', 'Connect with students going to Berlin'),
('Madrid', 'Spain', 'Meet fellow students heading to Madrid'),
('Vienna', 'Austria', 'Connect with students planning their Vienna exchange'),
('Prague', 'Czech Republic', 'Chat with students going to Prague'),
('Stockholm', 'Sweden', 'Connect with students heading to Stockholm');

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.chat_messages;
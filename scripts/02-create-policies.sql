-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Filmmaker profiles policies
CREATE POLICY "Anyone can view verified filmmaker profiles" ON public.filmmaker_profiles
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Filmmakers can manage own profile" ON public.filmmaker_profiles
  FOR ALL USING (user_id = auth.uid());

-- Films policies
CREATE POLICY "Anyone can view published films" ON public.films
  FOR SELECT USING (status = 'published');

CREATE POLICY "Filmmakers can manage own films" ON public.films
  FOR ALL USING (
    filmmaker_id IN (
      SELECT id FROM public.filmmaker_profiles WHERE user_id = auth.uid()
    )
  );

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- User film access policies
CREATE POLICY "Users can view own film access" ON public.user_film_access
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create film access" ON public.user_film_access
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Film views policies
CREATE POLICY "Users can view own viewing history" ON public.film_views
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create view records" ON public.film_views
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Job postings policies
CREATE POLICY "Anyone can view open job postings" ON public.job_postings
  FOR SELECT USING (status = 'open');

CREATE POLICY "Users can manage own job postings" ON public.job_postings
  FOR ALL USING (poster_id = auth.uid());

-- Co-production projects policies
CREATE POLICY "Anyone can view seeking projects" ON public.coproduction_projects
  FOR SELECT USING (status = 'seeking_partners');

CREATE POLICY "Filmmakers can manage own projects" ON public.coproduction_projects
  FOR ALL USING (
    creator_id IN (
      SELECT id FROM public.filmmaker_profiles WHERE user_id = auth.uid()
    )
  );

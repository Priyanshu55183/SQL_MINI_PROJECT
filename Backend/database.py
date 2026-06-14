"""database.py — Supabase client instances"""
from supabase import create_client
from config import SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY

# Public client — respects RLS (used for user requests)
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Service client — bypasses RLS (used for admin requests only)
supabase_admin = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
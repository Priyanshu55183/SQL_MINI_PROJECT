"""config.py — loads all environment variables"""
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL          = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY     = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_KEY")

JWT_SECRET            = os.getenv("JWT_SECRET", "changeme")
JWT_ALGORITHM         = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES    = int(os.getenv("JWT_EXPIRE_MINUTES", 10080))

ADMIN_EMAIL           = os.getenv("ADMIN_EMAIL", "owner@bitebyte.com")
FRONTEND_URL          = os.getenv("FRONTEND_URL", "http://localhost:5173")
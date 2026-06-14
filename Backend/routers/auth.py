"""routers/auth.py — /auth/register, /auth/login, /auth/me"""
from fastapi import APIRouter, HTTPException, Depends
from schemas import RegisterRequest, LoginRequest, TokenResponse, ProfileUpdate
from database import supabase, supabase_admin
from auth import create_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    # 1. Create user in Supabase Auth
    try:
        res = supabase.auth.sign_up({"email": req.email, "password": req.password})
        user = res.user
        if not user:
            raise HTTPException(400, "Registration failed")
    except Exception as e:
        raise HTTPException(400, str(e))

    # 2. Insert/Upsert profile row (upsert handles trigger conflicts)
    try:
        supabase_admin.table("profiles").upsert({
            "id":        user.id,
            "full_name": req.full_name,
            "phone":     req.phone,
            "address":   req.address,
            "goal":      "balanced",
        }).execute()
    except Exception as e:
        print(f"Profile creation warning: {e}")

    token = create_token(user.id, req.email)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        full_name=req.full_name,
        email=req.email,
        goal="balanced",
    )


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    try:
        res = supabase.auth.sign_in_with_password({"email": req.email, "password": req.password})
        user = res.user
        if not user:
            raise HTTPException(401, "Invalid credentials")
    except Exception:
        raise HTTPException(401, "Invalid email or password")

    # Fetch profile, heal if missing
    try:
        profile = supabase_admin.table("profiles").select("*").eq("id", user.id).single().execute()
        p = profile.data or {}
    except Exception:
        # Profile row is missing. Upsert a default profile row to prevent lockout
        try:
            email_name = req.email.split("@")[0].capitalize()
            p_res = supabase_admin.table("profiles").upsert({
                "id":        user.id,
                "full_name": email_name,
                "goal":      "balanced",
            }).execute()
            p = p_res.data[0] if p_res.data else {"full_name": email_name, "goal": "balanced"}
        except Exception as e:
            print(f"Failed to auto-create profile: {e}")
            p = {"full_name": req.email.split("@")[0].capitalize(), "goal": "balanced"}

    token = create_token(user.id, req.email)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        full_name=p.get("full_name", "") or req.email.split("@")[0].capitalize(),
        email=req.email,
        goal=p.get("goal", "balanced") or "balanced",
    )


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    email = current_user.get("email", "")
    try:
        profile = supabase_admin.table("profiles").select("*").eq("id", user_id).single().execute()
        return profile.data
    except Exception:
        # Fallback profile skeleton
        return {
            "id": user_id,
            "full_name": email.split("@")[0].capitalize() if email else "User",
            "phone": "",
            "address": "",
            "goal": "balanced"
        }


@router.put("/me")
def update_profile(req: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    updates = {k: v for k, v in req.model_dump().items() if v is not None}
    try:
        supabase_admin.table("profiles").update(updates).eq("id", user_id).execute()
    except Exception as e:
        # Try upsert if update fails due to profile missing
        try:
            updates["id"] = user_id
            if "full_name" not in updates:
                updates["full_name"] = current_user.get("email", "User").split("@")[0].capitalize()
            supabase_admin.table("profiles").upsert(updates).execute()
        except Exception:
            raise HTTPException(500, f"Failed to update profile: {str(e)}")
    return {"success": True}
"""routers/menu.py — /menu, /menu/categories, /menu/search"""
from fastapi import APIRouter, HTTPException, Query
from database import supabase
from schemas import FoodItemResponse
from typing import List, Optional

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("", response_model=List[FoodItemResponse])
def get_menu(search: Optional[str] = Query(None, description="Search dish name (SQL ILIKE)")):
    q = supabase.table("food_items") \
        .select("*") \
        .eq("is_available", True)

    if search and search.strip():
        q = q.ilike("item_name", f"%{search.strip()}%")

    res = q.order("category").execute()
    return res.data


@router.get("/categories")
def get_categories():
    res = supabase.table("food_items") \
        .select("category") \
        .eq("is_available", True) \
        .execute()
    cats = sorted(set(r["category"] for r in res.data))
    return cats


@router.get("/{item_id}", response_model=FoodItemResponse)
def get_item(item_id: int):
    res = supabase.table("food_items").select("*").eq("item_id", item_id).single().execute()
    if not res.data:
        raise HTTPException(404, "Item not found")
    return res.data
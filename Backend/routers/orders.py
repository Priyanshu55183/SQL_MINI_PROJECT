"""routers/orders.py — /orders/place, /orders/my"""
from fastapi import APIRouter, Depends, HTTPException
from database import supabase_admin
from schemas import PlaceOrderRequest, OrderResponse
from auth import get_current_user
from typing import List
import traceback

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/place")
def place_order(req: PlaceOrderRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        # 1. Insert order (no FK to profiles — just store user_id as text)
        order_res = supabase_admin.table("orders").insert({
            "user_id":      user_id,
            "total_price":  req.total_price,
            "total_cal":    req.total_cal,
            "order_status": "Pending",
        }).execute()

        if not order_res.data:
            raise HTTPException(500, "Failed to create order — no data returned")

        order_id = order_res.data[0]["order_id"]

        # 2. Insert order items
        items_payload = [
            {
                "order_id":   order_id,
                "item_id":    item.item_id,
                "item_name":  item.item_name,
                "quantity":   item.quantity,
                "unit_price": item.unit_price,
                "calories":   item.calories,
            }
            for item in req.items
        ]
        supabase_admin.table("order_items").insert(items_payload).execute()

        return {"success": True, "order_id": order_id}

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Order failed: {str(e)}")


@router.get("/my", response_model=List[OrderResponse])
def my_orders(current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        orders_res = supabase_admin.table("orders") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()

        result = []
        for o in orders_res.data:
            items_res = supabase_admin.table("order_items") \
                .select("item_name, quantity, unit_price, calories") \
                .eq("order_id", o["order_id"]) \
                .execute()
            result.append({
                **o,
                "created_at": str(o["created_at"])[:16],
                "items": items_res.data,
            })
        return result

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Failed to fetch orders: {str(e)}")
"""routers/orders.py — /orders/place, /orders/my, /orders/analytics"""
from fastapi import APIRouter, Depends, HTTPException, Query
from database import supabase_admin
from schemas import PlaceOrderRequest, OrderResponse
from auth import get_current_user
from typing import List, Optional
from collections import Counter
import traceback

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/place")
def place_order(req: PlaceOrderRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]

    try:
        # 1. Insert order
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
def my_orders(
    current_user: dict = Depends(get_current_user),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(10, ge=1, le=50, description="Items per page (SQL LIMIT)"),
):
    """Fetch user orders with SQL LIMIT/OFFSET pagination"""
    user_id = current_user["sub"]
    offset = (page - 1) * limit

    try:
        orders_res = supabase_admin.table("orders") \
            .select("*", count="exact") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .range(offset, offset + limit - 1) \
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


@router.get("/analytics")
def order_analytics(current_user: dict = Depends(get_current_user)):
    """Per-user order analytics: total spent, calorie history, most ordered items"""
    user_id = current_user["sub"]

    try:
        # Fetch all orders with items
        orders_res = supabase_admin.table("orders") \
            .select("order_id, total_price, total_cal, created_at, order_status") \
            .eq("user_id", user_id) \
            .order("created_at", desc=False) \
            .execute()

        total_orders = len(orders_res.data)
        total_spent  = sum(o["total_price"] for o in orders_res.data)
        total_cal    = sum(o["total_cal"] for o in orders_res.data)
        avg_cal      = round(total_cal / total_orders) if total_orders > 0 else 0

        # Calorie history (for chart)
        calorie_history = [
            {"date": str(o["created_at"])[:10], "calories": o["total_cal"], "price": o["total_price"]}
            for o in orders_res.data
        ]

        # Most ordered items
        item_counter = Counter()
        for o in orders_res.data:
            items_res = supabase_admin.table("order_items") \
                .select("item_name, quantity") \
                .eq("order_id", o["order_id"]) \
                .execute()
            for item in items_res.data:
                item_counter[item["item_name"]] += item["quantity"]

        top_items = [
            {"item_name": name, "count": count}
            for name, count in item_counter.most_common(5)
        ]

        return {
            "total_orders":   total_orders,
            "total_spent":    round(total_spent, 2),
            "total_calories": total_cal,
            "avg_calories":   avg_cal,
            "calorie_history": calorie_history,
            "top_items":       top_items,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, f"Failed to fetch analytics: {str(e)}")
"""routers/admin.py — all /admin/* routes, protected by require_admin"""
from fastapi import APIRouter, Depends
from database import supabase_admin
from schemas import FoodItemUpdate, UpdateStatusRequest
from auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
def stats(_=Depends(require_admin)):
    users   = supabase_admin.table("profiles").select("id", count="exact").execute()
    orders  = supabase_admin.table("orders").select("order_id", count="exact").execute()
    revenue = supabase_admin.table("orders").select("total_price").execute()
    pending = supabase_admin.table("orders").select("order_id", count="exact").eq("order_status", "Pending").execute()
    today_orders = supabase_admin.table("orders").select("order_id", count="exact") \
        .gte("created_at", "now()::date").execute()

    total_rev = sum(r["total_price"] for r in revenue.data)
    return {
        "total_users":   users.count,
        "total_orders":  orders.count,
        "total_revenue": round(total_rev, 2),
        "pending":       pending.count,
        "today_orders":  today_orders.count,
    }


@router.get("/orders")
def all_orders(search: str = "", _=Depends(require_admin)):
    q = supabase_admin.table("orders").select(
        "order_id, user_id, total_price, total_cal, order_status, created_at, profiles(full_name, phone)"
    ).order("created_at", desc=True)
    orders = q.execute().data

    result = []
    for o in orders:
        items_res = supabase_admin.table("order_items") \
            .select("item_name, quantity, unit_price, calories") \
            .eq("order_id", o["order_id"]).execute()
        profile = o.get("profiles") or {}
        entry = {
            "order_id":    o["order_id"],
            "user_id":     o["user_id"],
            "full_name":   profile.get("full_name", "Unknown"),
            "phone":       profile.get("phone", ""),
            "total_price": o["total_price"],
            "total_cal":   o["total_cal"],
            "order_status":o["order_status"],
            "created_at":  str(o["created_at"])[:16],
            "items":       items_res.data,
        }
        if not search or search.lower() in entry["full_name"].lower() \
                or any(search.lower() in i["item_name"].lower() for i in items_res.data):
            result.append(entry)
    return result


@router.get("/users")
def all_users(_=Depends(require_admin)):
    res = supabase_admin.table("profiles").select("*").order("full_name").execute()
    return res.data


@router.put("/order/status")
def update_status(req: UpdateStatusRequest, _=Depends(require_admin)):
    supabase_admin.table("orders") \
        .update({"order_status": req.status}) \
        .eq("order_id", req.order_id).execute()
    return {"success": True}


@router.delete("/order/{order_id}")
def delete_order(order_id: int, _=Depends(require_admin)):
    supabase_admin.table("order_items").delete().eq("order_id", order_id).execute()
    supabase_admin.table("orders").delete().eq("order_id", order_id).execute()
    return {"success": True}


@router.put("/menu/{item_id}")
def update_menu_item(item_id: int, req: FoodItemUpdate, _=Depends(require_admin)):
    updates = {k: v for k, v in req.model_dump().items() if v is not None}
    supabase_admin.table("food_items").update(updates).eq("item_id", item_id).execute()
    return {"success": True}


@router.get("/revenue")
def revenue_report(_=Depends(require_admin)):
    items = supabase_admin.table("order_items") \
        .select("item_name, quantity, unit_price, calories").execute()
    summary = {}
    for i in items.data:
        name = i["item_name"]
        if name not in summary:
            summary[name] = {"item_name": name, "total_qty": 0, "total_revenue": 0, "total_cal": 0}
        summary[name]["total_qty"]     += i["quantity"]
        summary[name]["total_revenue"] += i["unit_price"] * i["quantity"]
        summary[name]["total_cal"]     += i["calories"] * i["quantity"]
    return sorted(summary.values(), key=lambda x: x["total_revenue"], reverse=True)
"""schemas.py — Pydantic models for request/response validation"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ── Auth ────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = ""
    address: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    full_name: str
    email: str
    goal: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    goal: Optional[str] = None   # weight_loss | muscle_gain | balanced


# ── Food Items ──────────────────────────────────────────────────
class FoodItemResponse(BaseModel):
    item_id: int
    item_name: str
    category: str
    price: float
    description: Optional[str] = ""
    is_veg: bool
    is_available: bool
    calories: int
    protein: float
    carbs: float
    fat: float

class FoodItemUpdate(BaseModel):
    item_name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    is_veg: Optional[bool] = None
    is_available: Optional[bool] = None
    calories: Optional[int] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None


# ── Orders ──────────────────────────────────────────────────────
class CartItem(BaseModel):
    item_id: int
    item_name: str
    quantity: int
    unit_price: float
    calories: int

class PlaceOrderRequest(BaseModel):
    items: List[CartItem]
    total_price: float
    total_cal: int

class OrderItemResponse(BaseModel):
    item_name: str
    quantity: int
    unit_price: float
    calories: int

class OrderResponse(BaseModel):
    order_id: int
    total_price: float
    total_cal: int
    order_status: str
    created_at: str
    items: List[OrderItemResponse] = []


# ── Admin ───────────────────────────────────────────────────────
class UpdateStatusRequest(BaseModel):
    order_id: int
    status: str

class AdminOrderResponse(BaseModel):
    order_id: int
    user_id: Optional[str]
    full_name: Optional[str]
    total_price: float
    total_cal: int
    order_status: str
    created_at: str
    items: List[OrderItemResponse] = []
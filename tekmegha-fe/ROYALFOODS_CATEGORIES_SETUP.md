# Royal Foods Categories Setup

## Overview
Royal Foods is a specialist in fresh Indian breads, offering four traditional bread varieties: Chapati, Poori, Pulka, and Parota.

## Store Information
- **Store Name**: Royal Foods
- **Store Code**: royalfoods
- **Store Type**: Food (Indian Breads Specialist)
- **Specialization**: Traditional Indian flatbreads

## Categories

### Main Categories (4)

#### 1. Chapati 🫓
**Description**: Soft whole wheat flatbread, a staple in Indian cuisine

**Characteristics**:
- Made from whole wheat flour
- Cooked on tawa (flat griddle)
- Soft and pliable
- Healthy option
- Available with butter or ghee

**Sample Products**:
- Plain Chapati - ₹15
- Butter Chapati - ₹20
- Ghee Chapati - ₹25

---

#### 2. Poori 🥯
**Description**: Deep-fried puffed bread, crispy and golden

**Characteristics**:
- Deep-fried in oil
- Puffed and crispy
- Golden brown color
- Perfect with curries
- Available in plain and spiced varieties

**Sample Products**:
- Plain Poori - ₹30 (2 pieces)
- Masala Poori - ₹35 (2 pieces)
- Kashmiri Poori - ₹40 (2 pieces)

---

#### 3. Pulka 🥖
**Description**: Thin unleavened flatbread, light and healthy

**Characteristics**:
- Thinner than chapati
- Unleavened
- Light and healthy
- Quick to prepare
- Available in wheat and jowar

**Sample Products**:
- Plain Pulka - ₹12
- Ghee Pulka - ₹18
- Jowar Pulka - ₹20 (gluten-free)

---

#### 4. Parota 🥐
**Description**: Layered flatbread, flaky and delicious

**Characteristics**:
- Multi-layered structure
- Flaky texture
- Rich and indulgent
- Various regional styles
- Can be stuffed with fillings

**Sample Products**:
- Plain Parota - ₹35
- Malabar Parota - ₹40 (Kerala style)
- Coin Parota - ₹45 (bite-sized)
- Wheat Parota - ₹38 (healthier)
- Cheese Parota - ₹55 (premium)

---

## Category Features

### Simple Structure
- **4 Main Categories** - No subcategories needed
- **Clear Classification** - Each bread type is distinct
- **Easy Navigation** - Simple menu structure
- **Quick Selection** - Direct category access

### Product Organization
- **3-5 products per category**
- **Price range**: ₹12 - ₹55
- **Serves**: 1-2 pieces per order
- **Preparation time**: 4-15 minutes

## Setup Instructions

### 1. Run the Categories Script
```sql
-- Copy and paste the contents of insert-royalfoods-categories.sql
```

### 2. Verify Creation
```sql
SELECT name, slug, description, sort_order
FROM categories 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')
ORDER BY sort_order;
```

**Expected Result**: 4 categories

### 3. Add Products
```sql
-- Copy and paste the contents of insert-royalfoods-products.sql
```

## Application Integration

### Category Icons
```typescript
// Bread-themed icons
categories: [
  { name: 'Chapati', icon: 'bakery_dining' },
  { name: 'Poori', icon: 'breakfast_dining' },
  { name: 'Pulka', icon: 'restaurant' },
  { name: 'Parota', icon: 'ramen_dining' }
]
```

### Hero Content
```typescript
heroTitle: 'Fresh Indian Breads'
heroSubtitle: 'Traditional breads made fresh daily'
```

## Product Details

### Total Products: 14

#### Chapati (3 products)
- Plain, Butter, Ghee variants
- Price: ₹15 - ₹25
- Prep time: 5 minutes

#### Poori (3 products)
- Plain, Masala, Kashmiri variants
- Price: ₹30 - ₹40
- Prep time: 8-10 minutes
- Serves: 2 pieces

#### Pulka (3 products)
- Plain, Ghee, Jowar variants
- Price: ₹12 - ₹20
- Prep time: 4-5 minutes
- Includes gluten-free option

#### Parota (5 products)
- Plain, Malabar, Coin, Wheat, Cheese variants
- Price: ₹35 - ₹55
- Prep time: 10-15 minutes
- Most variety in this category

## SKU Format

All products use standardized SKU:
- **Chapati**: RF-CHP-001, RF-CHP-002, RF-CHP-003
- **Poori**: RF-POO-001, RF-POO-002, RF-POO-003
- **Pulka**: RF-PUL-001, RF-PUL-002, RF-PUL-003
- **Parota**: RF-PAR-001 through RF-PAR-005

## Tags & Attributes

### Common Tags
- `vegetarian` - All products are vegetarian
- `wheat` - Wheat-based breads
- `healthy` - Health-conscious options
- `fresh` - Made fresh daily
- `popular` - Customer favorites
- `premium` - Special varieties

### Product Features
- ✅ All vegetarian
- ✅ Made fresh on order
- ✅ Various customization options
- ✅ Different serving sizes
- ✅ Quick preparation (4-15 mins)

## Testing

### 1. Category Count
```sql
SELECT COUNT(*) as total_categories
FROM categories 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods');
```
**Expected**: 4 categories

### 2. Product Distribution
```sql
SELECT 
  category,
  COUNT(*) as count,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')
GROUP BY category
ORDER BY category;
```

**Expected**:
- Chapati: 3 products (₹15-₹25)
- Parota: 5 products (₹35-₹55)
- Poori: 3 products (₹30-₹40)
- Pulka: 3 products (₹12-₹20)

## Summary

Royal Foods specializes in Indian breads with:
- ✅ 4 simple categories
- ✅ 14 quality products
- ✅ Focus on traditional recipes
- ✅ Fresh daily preparation
- ✅ Affordable pricing
- ✅ Quick service

Perfect for customers looking for authentic Indian flatbreads! 🍞


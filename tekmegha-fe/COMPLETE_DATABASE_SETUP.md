# Complete Database Setup Guide

This guide provides the correct order for setting up the complete database schema for the TekMegha application.

## 📋 **Setup Order (IMPORTANT)**

### **Step 1: Core Schema**
Run the main schema first:
```sql
-- Run supabase-multi-brand-schema-fixed.sql
-- This creates the core tables: megha_stores, store_locations, products, etc.
```

### **Step 2: Categories Table**
```sql
-- Run supabase-categories-setup.sql
-- This creates the categories table and default categories
```

### **Step 3: Location Inventory Table**
```sql
-- Run create-location-inventory-table.sql
-- This creates the location_inventory table for tracking stock
```

### **Step 4: User Access Setup**
```sql
-- Run setup-inventory-access.sql
-- This assigns roles to tm@tekmegha.com and sarada@tekmegha.com
```

### **Step 5: Inventory Dashboard (Optional)**
```sql
-- Run create-inventory-dashboard.sql
-- This creates the inventory dashboard view and helper functions
```

### **Step 6: Advanced Features (Optional)**
```sql
-- Run inventory-access-schema.sql
-- This adds advanced RLS policies (after all tables exist)
```

## 🗂️ **Table Dependencies**

### **Core Tables (Step 1)**
- ✅ `megha_stores` - Store information
- ✅ `store_locations` - Physical store locations
- ✅ `products` - Product catalog
- ✅ `user_roles` - User permissions
- ✅ `cart_items` - Shopping cart
- ✅ `orders` - Order management

### **Categories (Step 2)**
- ✅ `categories` - Product categories
- ✅ **Depends on**: `megha_stores`

### **Location Inventory (Step 3)**
- ✅ `location_inventory` - Stock tracking per location
- ✅ **Depends on**: `products`, `store_locations`

### **User Access (Step 4)**
- ✅ **Depends on**: `user_roles`, `megha_stores`

### **Advanced Features (Step 5)**
- ✅ **Depends on**: All previous tables

## 🚀 **Quick Setup Commands**

### **1. Core Schema**
```bash
# Run in Supabase SQL Editor
psql -f supabase-multi-brand-schema-fixed.sql
```

### **2. Categories**
```bash
psql -f supabase-categories-setup.sql
```

### **3. Location Inventory**
```bash
psql -f create-location-inventory-table.sql
```

### **4. User Access**
```bash
psql -f setup-inventory-access.sql
```

### **5. Inventory Dashboard**
```bash
psql -f create-inventory-dashboard.sql
```

### **6. Advanced Features**
```bash
psql -f inventory-access-schema.sql
```

## 🔍 **Verification Queries**

### **Check Core Tables**
```sql
-- Verify core tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('megha_stores', 'store_locations', 'products', 'user_roles');
```

### **Check Categories**
```sql
-- Verify categories were created
SELECT 
    c.name as category_name,
    ms.store_name,
    c.is_active
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
ORDER BY ms.store_code, c.sort_order;
```

### **Check Location Inventory**
```sql
-- Verify location_inventory table exists
SELECT COUNT(*) FROM location_inventory;
```

### **Check User Roles**
```sql
-- Verify user roles were assigned
SELECT 
    au.email,
    ur.role,
    ms.store_name
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE au.email IN ('tm@tekmegha.com', 'sarada@tekmegha.com');
```

### **Check Inventory Dashboard**
```sql
-- Verify inventory dashboard was created
SELECT 
    product_name,
    store_name,
    total_quantity,
    available_quantity
FROM inventory_dashboard
LIMIT 10;
```

## 🛠️ **Troubleshooting**

### **Common Errors**

#### **1. "column location_inventory.location_id does not exist"**
- ✅ **Solution**: Run `create-location-inventory-table.sql` first
- ✅ **Check**: Verify the table was created successfully

#### **2. "categories_with_store is not a table"**
- ✅ **Solution**: Use `categories` table with joins instead of views
- ✅ **Check**: Use the Supabase client with proper joins

#### **3. "relation does not exist"**
- ✅ **Solution**: Run the setup in the correct order
- ✅ **Check**: Verify all dependencies are created first

### **Debug Steps**

#### **1. Check Table Existence**
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

#### **2. Check Column Structure**
```sql
-- Check location_inventory columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'location_inventory';
```

#### **3. Check RLS Policies**
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📊 **What Each Step Provides**

### **Step 1: Core Schema**
- ✅ **Multi-store support** with megha_stores
- ✅ **Product catalog** with products table
- ✅ **User management** with user_roles
- ✅ **Shopping cart** and order management

### **Step 2: Categories**
- ✅ **Product categorization** system
- ✅ **Store-specific categories** for each brand
- ✅ **Hierarchical categories** support
- ✅ **SEO-friendly slugs**

### **Step 3: Location Inventory**
- ✅ **Stock tracking** per location
- ✅ **Reserved quantity** management
- ✅ **Reorder level** alerts
- ✅ **Inventory functions** for reservations

### **Step 4: User Access**
- ✅ **Role-based access** for team members
- ✅ **Store-specific permissions**
- ✅ **Inventory management** access
- ✅ **Secure data isolation**

### **Step 5: Advanced Features**
- ✅ **Advanced RLS policies**
- ✅ **Inventory dashboard** view
- ✅ **Performance indexes**
- ✅ **Helper functions**

## 🎯 **Expected Results**

After completing all steps, you should have:

- ✅ **3 stores**: Brew Buddy, Little Ducks, Majili
- ✅ **6 categories**: 2 per store
- ✅ **Location inventory**: Stock tracking system
- ✅ **User access**: Team members with proper roles
- ✅ **Security**: RLS policies protecting data
- ✅ **Performance**: Optimized indexes

## 📞 **Support**

If you encounter issues:

1. **Check the order**: Ensure you're running scripts in the correct sequence
2. **Verify dependencies**: Make sure all required tables exist
3. **Check logs**: Look at Supabase logs for specific errors
4. **Test step by step**: Run verification queries after each step
5. **Contact team**: Reach out for technical support

---

**Remember**: Always run the setup in the correct order to avoid dependency errors! 🎉

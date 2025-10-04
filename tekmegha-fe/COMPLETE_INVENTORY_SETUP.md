# Complete Inventory Setup Guide

This guide provides the complete setup for the inventory system, including the missing categories table.

## 📋 **Setup Order**

### **Step 1: Create Categories Table**
Run `create-categories-table.sql` first to create the categories table:

```sql
-- This creates:
-- - Categories table with proper structure
-- - Default categories for each store
-- - RLS policies for security
-- - Indexes for performance
```

### **Step 2: Setup User Access**
Run `setup-inventory-access.sql` to assign roles to team members:

```sql
-- This assigns:
-- - tm@tekmegha.com as inventory_manager
-- - sarada@tekmegha.com as inventory_specialist
```

### **Step 3: Advanced Features (Optional)**
Run `inventory-access-schema.sql` for advanced features:

```sql
-- This includes:
-- - Advanced RLS policies
-- - Inventory dashboard
-- - Helper functions
-- - Performance optimizations
```

## 🗂️ **Categories Table Structure**

### **Table Schema**
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) NOT NULL,
    megha_store_id UUID REFERENCES megha_stores(id),
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Default Categories Created**

#### **Brew Buddy Store**
- ☕ **Coffee & Beverages** - Hot and cold coffee drinks, teas
- 🥐 **Food & Snacks** - Pastries, sandwiches, light meals

#### **Little Ducks Store**
- 🧸 **Toys & Games** - Educational toys, action figures, board games
- 📚 **Educational** - Learning toys and educational materials

#### **Opula Store**
- 👗 **Clothing** - Fashion clothing and accessories
- 💍 **Accessories** - Fashion accessories and jewelry

## 🔐 **Security Features**

### **Row Level Security (RLS)**
- ✅ **Public Access**: Anyone can read active categories
- ✅ **Store Access**: Users can only see categories for their authorized stores
- ✅ **Management Access**: Only inventory managers can create/edit categories

### **Permission Levels**
- **Public**: Can view active categories
- **Store Users**: Can view categories for their stores
- **Inventory Managers**: Full CRUD access to categories
- **Store Admins**: Can manage categories for their stores

## 🚀 **Quick Setup Commands**

### **1. Create Categories Table**
```bash
# Run this in Supabase SQL Editor
psql -f create-categories-table.sql
```

### **2. Setup User Access**
```bash
# Run this after users register
psql -f setup-inventory-access.sql
```

### **3. Verify Setup**
```sql
-- Check categories were created
SELECT 
    c.name as category_name,
    ms.store_name,
    c.is_active
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
ORDER BY ms.store_code, c.sort_order;

-- Check user roles
SELECT 
    au.email,
    ur.role,
    ms.store_name
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE au.email IN ('tm@tekmegha.com', 'sarada@tekmegha.com');
```

## 🎯 **What Users Can Do**

### **Category Management**
- ✅ **View Categories**: See all categories for their stores
- ✅ **Create Categories**: Add new product categories
- ✅ **Edit Categories**: Update category information
- ✅ **Organize Categories**: Set sort order and hierarchy
- ✅ **Manage Status**: Activate/deactivate categories

### **Product Management**
- ✅ **Create Products**: Add products with category assignment
- ✅ **Edit Products**: Update product details and categories
- ✅ **Inventory Tracking**: Monitor stock levels
- ✅ **Multi-Store**: Manage products across all brands

## 📊 **Category Features**

### **Hierarchical Categories**
- ✅ **Parent-Child**: Categories can have subcategories
- ✅ **Unlimited Depth**: Support for complex category trees
- ✅ **Store-Specific**: Each store has its own category structure

### **Category Management**
- ✅ **Slugs**: SEO-friendly URLs for categories
- ✅ **Sort Order**: Custom ordering within stores
- ✅ **Images**: Category images and icons
- ✅ **Status Control**: Activate/deactivate categories

### **Performance**
- ✅ **Indexes**: Optimized for fast queries
- ✅ **Caching**: Efficient data retrieval
- ✅ **Search**: Fast category lookup

## 🛠️ **Troubleshooting**

### **Categories Not Showing**
1. Check if categories table exists: `SELECT * FROM categories LIMIT 1;`
2. Verify RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'categories';`
3. Check user permissions: `SELECT * FROM user_roles WHERE user_id = 'USER_ID';`

### **Permission Errors**
1. Verify user has inventory role: `SELECT role FROM user_roles WHERE user_id = 'USER_ID';`
2. Check store access: `SELECT megha_store_id FROM user_roles WHERE user_id = 'USER_ID';`
3. Verify category belongs to user's store

### **Setup Issues**
1. Run categories table creation first
2. Ensure users are registered before assigning roles
3. Check that stores exist and are active
4. Verify all SQL commands completed successfully

## 📞 **Support**

If you encounter issues:
1. **Check Logs**: Look at Supabase logs for errors
2. **Verify Setup**: Run verification queries
3. **Test Step by Step**: Create categories first, then assign roles
4. **Contact Team**: Reach out for technical support

---

**Note**: Always backup your database before running schema changes, and test in a development environment first.

# Inventory Access Setup Guide

This guide explains how to set up inventory access for team members in the TekMegha application.

## 📋 **Team Members to Setup**

- **tm@tekmegha.com** - Team Manager (Full Access)
- **sarada@tekmegha.com** - Inventory Specialist (Read/Write Access)

## 🔐 **Access Levels**

### **Team Manager (tm@tekmegha.com)**
- ✅ **Read**: View all products, inventory, and reports
- ✅ **Write**: Add, edit, and update products
- ✅ **Delete**: Remove products and inventory items
- ✅ **Manage Users**: Assign roles to other team members
- ✅ **All Stores**: Access to Brew Buddy, Little Ducks, and Majili stores

### **Inventory Specialist (sarada@tekmegha.com)**
- ✅ **Read**: View all products and inventory
- ✅ **Write**: Add and edit products
- ❌ **Delete**: Cannot delete products
- ❌ **Manage Users**: Cannot assign roles
- ✅ **All Stores**: Access to Brew Buddy, Little Ducks, and Majili stores

## 🚀 **Setup Process**

### **Step 1: User Registration**
1. **tm@tekmegha.com** needs to register in the application first
2. **sarada@tekmegha.com** needs to register in the application first
3. They can register through the normal signup process

### **Step 2: Get User IDs**
Run this query in your Supabase SQL editor to get the user IDs:

```sql
SELECT email, id, created_at 
FROM auth.users 
WHERE email IN ('tm@tekmegha.com', 'sarada@tekmegha.com');
```

### **Step 3: Get Store IDs**
Run this query to get the store IDs:

```sql
SELECT id, store_name, store_code 
FROM megha_stores 
WHERE is_active = true;
```

### **Step 4: Assign Roles**
Use the `setup-inventory-access.sql` file and replace the placeholder IDs:

```sql
-- Replace USER_ID_1 with tm@tekmegha.com's ID
-- Replace USER_ID_2 with sarada@tekmegha.com's ID
-- Replace STORE_ID_1, STORE_ID_2, STORE_ID_3 with actual store IDs
```

### **Step 5: Verify Setup**
Run this query to verify the roles were assigned correctly:

```sql
SELECT 
    au.email,
    ur.role,
    ur.permissions,
    ms.store_name,
    ur.is_active
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE au.email IN ('tm@tekmegha.com', 'sarada@tekmegha.com')
ORDER BY au.email, ms.store_name;
```

## 🔧 **Advanced Setup (Optional)**

If you want to use the comprehensive setup with additional features:

1. **Run the full schema**: Use `inventory-access-schema.sql`
2. **Includes**: 
   - Advanced RLS policies
   - Inventory dashboard view
   - Performance indexes
   - Helper functions

## 🎯 **What Users Can Do After Setup**

### **Access Inventory Module**
- Navigate to `/inventory-login`
- Login with their registered email
- Access inventory management interface

### **Manage Products**
- **Team Manager**: Full CRUD operations
- **Inventory Specialist**: Create and edit products

### **View Reports**
- Inventory dashboard
- Stock levels across all stores
- Product performance metrics

### **Multi-Store Access**
- Switch between different stores
- Manage inventory for each brand
- Store-specific product management

## 🛡️ **Security Features**

### **Row Level Security (RLS)**
- Users can only access data for stores they have permissions for
- Automatic filtering based on user roles
- Secure data isolation between stores

### **Role-Based Access Control**
- Different permission levels for different roles
- Granular control over what users can do
- Easy to modify permissions without code changes

## 📊 **Monitoring and Management**

### **Check User Access**
```sql
-- See all users with inventory access
SELECT 
    au.email,
    ur.role,
    ms.store_name,
    ur.created_at
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE ur.role IN ('inventory_manager', 'inventory_specialist')
ORDER BY au.email, ms.store_name;
```

### **Update User Permissions**
```sql
-- Update a user's role
UPDATE user_roles 
SET role = 'inventory_manager', 
    permissions = '["read", "write", "delete", "manage_users"]'::jsonb,
    updated_at = NOW()
WHERE user_id = 'USER_ID' 
AND megha_store_id = 'STORE_ID';
```

### **Deactivate User Access**
```sql
-- Deactivate a user's access
UPDATE user_roles 
SET is_active = false, 
    updated_at = NOW()
WHERE user_id = 'USER_ID';
```

## 🚨 **Troubleshooting**

### **User Can't Access Inventory**
1. Check if user is registered: `SELECT * FROM auth.users WHERE email = 'user@email.com';`
2. Check if roles are assigned: `SELECT * FROM user_roles WHERE user_id = 'USER_ID';`
3. Verify store is active: `SELECT * FROM megha_stores WHERE id = 'STORE_ID';`

### **Permission Errors**
1. Check user's role: `SELECT role, permissions FROM user_roles WHERE user_id = 'USER_ID';`
2. Verify RLS policies are active
3. Check if user is trying to access wrong store

### **Database Connection Issues**
1. Ensure Supabase connection is working
2. Check if RLS policies are properly configured
3. Verify user authentication is working

## 📞 **Support**

If you encounter any issues:
1. Check the Supabase logs for errors
2. Verify the SQL queries are running successfully
3. Test with a simple user role assignment first
4. Contact the development team for assistance

---

**Note**: Make sure to backup your database before running any schema changes, and test in a development environment first.

# Supabase Categories Access Guide

This guide explains how to properly access categories with store information in Supabase.

## ❌ **The Problem**

The error `"categories_with_store" is not a table` occurs because:
- Views in Supabase are not directly accessible via the client API
- You need to use the base table with joins instead
- Supabase client works with tables, not views

## ✅ **The Solution**

### **Method 1: Use Categories Table with Joins**

Instead of using a view, query the `categories` table with joins:

```typescript
// Get categories with store information
async getCategoriesWithStore(storeCode?: string) {
  let query = this.supabase
    .from('categories')
    .select(`
      *,
      megha_stores!inner(
        store_name,
        store_code,
        store_type
      )
    `)
    .eq('is_active', true);

  if (storeCode) {
    query = query.eq('megha_stores.store_code', storeCode);
  }

  const { data, error } = await query.order('sort_order');
  return { data, error };
}
```

### **Method 2: Use RPC Function (Advanced)**

If you created the function, you can call it via RPC:

```typescript
// Call the function to get categories with store info
async getCategoriesWithStoreFunction(storeCode?: string) {
  const { data, error } = await this.supabase
    .rpc('get_categories_with_store', { p_store_code: storeCode });
  
  return { data, error };
}
```

## 🚀 **Recommended Approach**

### **1. Use Categories Table with Joins**

This is the most reliable method for Supabase:

```typescript
// In your SupabaseService
async getCategories(storeCode?: string): Promise<{ data: any[] | null; error: any }> {
  try {
    let query = this.supabase
      .from('categories')
      .select(`
        *,
        megha_stores!inner(
          store_name,
          store_code,
          store_type
        )
      `)
      .eq('is_active', true);

    if (storeCode) {
      query = query.eq('megha_stores.store_code', storeCode);
    }

    const { data, error } = await query.order('sort_order');
    return { data, error };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: null, error };
  }
}

// Get categories for specific store
async getCategoriesForStore(storeCode: string): Promise<{ data: any[] | null; error: any }> {
  return this.getCategories(storeCode);
}

// Get all categories
async getAllCategories(): Promise<{ data: any[] | null; error: any }> {
  return this.getCategories();
}
```

### **2. Transform Data in Frontend**

```typescript
// Transform the data for easier use
transformCategoryData(category: any) {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    parentId: category.parent_id,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    imageUrl: category.image_url,
    storeName: category.megha_stores?.store_name,
    storeCode: category.megha_stores?.store_code,
    storeType: category.megha_stores?.store_type,
    createdAt: category.created_at,
    updatedAt: category.updated_at
  };
}
```

## 📱 **Frontend Usage**

### **Component Example**

```typescript
// In your component
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  currentStore = 'brew-buddy';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    const { data, error } = await this.supabaseService.getCategoriesForStore(this.currentStore);
    if (error) {
      console.error('Error loading categories:', error);
      return;
    }
    
    this.categories = data?.map(cat => this.transformCategoryData(cat)) || [];
  }

  private transformCategoryData(category: any) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      storeName: category.megha_stores?.store_name,
      storeCode: category.megha_stores?.store_code
    };
  }
}
```

### **Template Example**

```html
<div class="categories">
  <div *ngFor="let category of categories" class="category-card">
    <h3>{{ category.name }}</h3>
    <p>{{ category.description }}</p>
    <span class="store-badge">{{ category.storeName }}</span>
  </div>
</div>
```

## 🔧 **Database Setup**

### **1. Run the Categories Setup**

```sql
-- Run this in Supabase SQL Editor
-- This creates the categories table and default data
```

### **2. Verify Setup**

```sql
-- Check if categories were created
SELECT 
    c.name as category_name,
    c.slug,
    ms.store_name,
    ms.store_code,
    c.sort_order
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
ORDER BY ms.store_code, c.sort_order;
```

## 🎯 **Best Practices**

### **1. Always Use Joins**
- ✅ Use `categories` table with joins
- ❌ Don't try to use views directly
- ✅ Transform data in frontend

### **2. Handle Errors**
```typescript
async getCategories() {
  try {
    const { data, error } = await this.supabase
      .from('categories')
      .select(`
        *,
        megha_stores!inner(store_name, store_code)
      `)
      .eq('is_active', true);
    
    if (error) {
      console.error('Supabase error:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Network error:', error);
    return { data: null, error };
  }
}
```

### **3. Use Proper Filtering**
```typescript
// Filter by store
.eq('megha_stores.store_code', 'brew-buddy')

// Filter by active status
.eq('is_active', true)

// Order by sort order
.order('sort_order')
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"categories_with_store" is not a table**
   - ✅ Use `categories` table with joins instead
   - ✅ Don't try to access views directly

2. **No data returned**
   - ✅ Check if categories table exists
   - ✅ Verify RLS policies are correct
   - ✅ Check if default categories were inserted

3. **Permission errors**
   - ✅ Verify user has proper roles
   - ✅ Check RLS policies
   - ✅ Ensure user is authenticated

### **Debug Queries**

```sql
-- Check if categories exist
SELECT COUNT(*) FROM categories;

-- Check store relationships
SELECT 
    c.name,
    ms.store_name
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'categories';
```

## 📞 **Support**

If you encounter issues:
1. **Check the database**: Verify categories table exists
2. **Test queries**: Run SQL queries directly in Supabase
3. **Check permissions**: Verify RLS policies are working
4. **Contact team**: Reach out for technical support

---

**Remember**: Always use the `categories` table with joins, not views, when working with Supabase client! 🎉

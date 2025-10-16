# Invoice Schema Analysis

## 🔍 **Current Issues Found**

### **❌ Problems in `invoice-setup-megha-store.sql`:**

#### **1. Incorrect `invoices` Table Structure:**
```sql
-- WRONG (Current)
CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,                    -- Should be 'date'
    invoice_amount DECIMAL(10,2) NOT NULL,          -- Should be 'total'
    invoice_status VARCHAR(50) NOT NULL,            -- Not needed
    invoice_type VARCHAR(50) NOT NULL,              -- Not needed
    invoice_template_id BIGINT NOT NULL,            -- Should be 'store_id'
    CONSTRAINT invoices_invoice_template_id_fkey FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id),
    CONSTRAINT invoices_store_code_fkey FOREIGN KEY (store_code) REFERENCES megha_stores(store_code)  -- store_code not defined
);
```

#### **2. Incomplete `invoice_items` Table:**
```sql
-- WRONG (Current)
CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_quantity DECIMAL(10,2) NOT NULL,          -- Should be 'quantity'
    item_rate DECIMAL(10,2) NOT NULL,               -- Should be 'rate'
    item_amount DECIMAL(10,2) NOT NULL,             -- Should be 'amount'
    CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

### **✅ Correct Schema (from `invoice-schema.sql`):**

#### **1. Proper `invoices` Table:**
```sql
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    store_id BIGINT NOT NULL,
    
    -- Store Information
    store_name VARCHAR(255) NOT NULL,
    store_address TEXT,
    store_contact VARCHAR(50),
    store_gstin VARCHAR(20),
    
    -- Buyer Information
    buyer_name VARCHAR(255) NOT NULL,
    buyer_address TEXT,
    buyer_contact VARCHAR(50),
    buyer_gstin VARCHAR(20),
    
    -- Financial Details
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    sgst DECIMAL(12,2) NOT NULL DEFAULT 0,
    cgst DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_due DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_mode VARCHAR(50) NOT NULL DEFAULT 'Cash',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT,
    
    -- Constraints
    CONSTRAINT invoices_store_id_fkey FOREIGN KEY (store_id) REFERENCES megha_stores(id)
);
```

#### **2. Proper `invoice_items` Table:**
```sql
CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    amount DECIMAL(12,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
```

## 🏗️ **Do We Need `invoice_template_id` in `megha_stores`?**

### **✅ YES - It's Already Implemented and Working:**

#### **Current Implementation:**
```sql
-- Already exists in megha_stores table
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS invoice_template_id BIGINT,
ADD CONSTRAINT megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);
```

#### **Why It's Needed:**
1. **Store-Specific Templates** - Each store can have its own invoice template
2. **Template Configuration** - Stores can customize their invoice layout
3. **Brand Consistency** - Each store maintains its own branding
4. **Function Integration** - `get_store_invoice_template()` function uses it

#### **How It Works:**
```sql
-- Function that uses invoice_template_id
CREATE OR REPLACE FUNCTION get_store_invoice_template(store_code_param VARCHAR)
RETURNS TABLE(...) AS $$
BEGIN
    RETURN QUERY
    SELECT ...
    FROM megha_stores s
    LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id  -- Uses the column
    WHERE s.store_code = store_code_param;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 **Required Fixes**

### **1. Fix `invoice-setup-megha-store.sql`:**
- **Replace incorrect table definitions** with proper ones
- **Remove unnecessary columns** (invoice_status, invoice_type)
- **Add missing columns** (store_name, buyer_name, financial details)
- **Fix foreign key references**

### **2. Keep `invoice_template_id` in `megha_stores`:**
- **Already working correctly**
- **Needed for template system**
- **Used by invoice generation functions**

### **3. Update Frontend Interface:**
- **Match database field names** with TypeScript interface
- **Use proper property names** in templates

## 📊 **Schema Comparison**

| Aspect | Current (Wrong) | Correct |
|--------|----------------|---------|
| **Date Field** | `invoice_date` | `date` |
| **Amount Field** | `invoice_amount` | `total` |
| **Store Reference** | `invoice_template_id` | `store_id` |
| **Buyer Info** | Missing | `buyer_name`, `buyer_address` |
| **Financial Details** | Missing | `subtotal`, `discount`, `sgst`, `cgst` |
| **Items Quantity** | `item_quantity` | `quantity` |
| **Items Rate** | `item_rate` | `rate` |
| **Items Amount** | `item_amount` | `amount` |

## 🚀 **Recommended Action**

### **1. Use Corrected Schema:**
```bash
# Apply the corrected schema
psql -d your_database -f corrected-invoice-schema.sql
```

### **2. Keep Template System:**
- **Keep `invoice_template_id` in `megha_stores`**
- **Keep `invoice_templates` table**
- **Keep `get_store_invoice_template()` function**

### **3. Test Invoice Creation:**
- **Create test invoice** with proper structure
- **Verify template loading** works correctly
- **Test invoice items** are saved properly

## ✅ **Summary**

1. **Current `invoice-setup-megha-store.sql` has wrong schema** ❌
2. **`invoice-schema.sql` has correct schema** ✅
3. **`invoice_template_id` in `megha_stores` is needed and working** ✅
4. **Frontend needs to match database field names** ⚠️

**Next Step:** Apply the corrected schema to fix the database structure! 🎯

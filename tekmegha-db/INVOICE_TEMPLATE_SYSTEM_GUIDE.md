# Invoice Template System - Refactored Architecture

## Overview
The invoice template system has been refactored to use **store-agnostic templates** that can be reused across multiple stores. This eliminates the need for duplicate templates and makes the system more maintainable and scalable.

## Key Changes

### 🔄 **Before (Store-Specific Templates)**
```sql
-- Old approach: Each store had its own template
invoice_templates.store_id → specific store
default_items.store_id → specific store
```

### ✅ **After (Reusable Templates)**
```sql
-- New approach: Templates are reusable across stores
invoice_templates.template_code → 'retail', 'food', 'coffee', etc.
megha_stores.invoice_template_id → references template
default_items.template_id → references template
```

## Database Schema

### 1. **invoice_templates** Table (Store-Agnostic)
```sql
CREATE TABLE invoice_templates (
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(50) UNIQUE NOT NULL,    -- 'retail', 'food', 'coffee'
    template_name VARCHAR(100) NOT NULL,          -- 'Retail Store Template'
    template_description TEXT,                    -- Description of template use
    
    -- Default configurations (can be overridden)
    default_store_name VARCHAR(255),
    default_store_address TEXT,
    default_store_contact VARCHAR(50),
    default_store_gstin VARCHAR(20),
    
    -- Invoice settings
    default_payment_mode VARCHAR(50) DEFAULT 'Cash',
    tax_rate DECIMAL(5,2) DEFAULT 9.00,
    currency VARCHAR(10) DEFAULT 'INR',
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    
    -- Styling
    primary_color VARCHAR(7) DEFAULT '#dc2626',
    secondary_color VARCHAR(7) DEFAULT '#ffffff',
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false,     -- System templates cannot be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **megha_stores** Table (Updated)
```sql
-- Added template reference
ALTER TABLE megha_stores 
ADD COLUMN invoice_template_id BIGINT,
ADD CONSTRAINT megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);
```

### 3. **default_items** Table (Template-Based)
```sql
CREATE TABLE default_items (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,              -- References template, not store
    item_name VARCHAR(255) NOT NULL,
    default_rate DECIMAL(10,2) NOT NULL,
    default_quantity INTEGER DEFAULT 1,
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);
```

## System Templates

### **Pre-Built Templates**
| Template Code | Template Name | Use Case | Invoice Prefix | Tax Rate | Primary Color |
|---------------|---------------|----------|----------------|----------|---------------|
| `retail` | Retail Store Template | General retail stores | INV | 9.00% | #dc2626 |
| `food` | Food Store Template | Grocery, food stores | FD | 5.00% | #059669 |
| `coffee` | Coffee Shop Template | Cafes, coffee shops | CB | 9.00% | #92400e |
| `insurance` | Insurance Agency Template | Insurance agencies | INS | 18.00% | #1e40af |
| `automotive` | Automotive Template | Auto services, parts | AUTO | 18.00% | #374151 |
| `fashion` | Fashion Store Template | Clothing, fashion | FSH | 12.00% | #be185d |
| `electronics` | Electronics Store Template | Electronics, digital | ELC | 18.00% | #7c3aed |
| `toys` | Toy Store Template | Toys, children products | TOY | 12.00% | #ea580c |

## Template Assignment Logic

### **Automatic Assignment Based on Store Code**
```sql
UPDATE megha_stores 
SET invoice_template_id = (
    SELECT id FROM invoice_templates 
    WHERE template_code = CASE 
        WHEN store_code LIKE '%brew%' OR store_code LIKE '%coffee%' THEN 'coffee'
        WHEN store_code LIKE '%food%' OR store_code LIKE '%royal%' THEN 'food'
        WHEN store_code LIKE '%insurance%' OR store_code LIKE '%dkassociates%' THEN 'insurance'
        WHEN store_code LIKE '%auto%' THEN 'automotive'
        WHEN store_code LIKE '%fashion%' THEN 'fashion'
        WHEN store_code LIKE '%electronic%' THEN 'electronics'
        WHEN store_code LIKE '%toy%' THEN 'toys'
        ELSE 'retail'
    END
);
```

## Usage Examples

### **1. Get Template for a Store**
```sql
-- Get invoice template configuration for a store
SELECT * FROM get_store_invoice_template('brew-buddy');

-- Result:
-- template_id | template_code | template_name | invoice_prefix | tax_rate | primary_color
-- 3           | coffee        | Coffee Shop   | CB             | 9.00     | #92400e
```

### **2. Get Default Items for a Template**
```sql
-- Get default items for coffee template
SELECT * FROM get_template_default_items(3);

-- Result:
-- item_name      | default_rate | default_quantity | category
-- Coffee Beans   | 250.00       | 1                | Coffee
-- Espresso Shot  | 45.00        | 2                | Coffee
-- Cappuccino     | 55.00        | 1                | Coffee
```

### **3. View Store-Template Relationships**
```sql
-- See all stores and their assigned templates
SELECT * FROM store_template_summary;

-- Result:
-- store_code | store_name | template_code | template_name | default_items_count
-- brew-buddy | Brew Buddy | coffee        | Coffee Shop   | 5
-- royalfoods | Royal Foods| food          | Food Store    | 4
-- dkassociates| DK Associates| insurance   | Insurance     | 4
```

### **4. Create Custom Template**
```sql
-- Create a new custom template
INSERT INTO invoice_templates (
    template_code, template_name, template_description,
    invoice_prefix, tax_rate, primary_color
) VALUES (
    'pharmacy', 'Pharmacy Template', 'Template for pharmacy stores',
    'PH', 12.00, '#10b981'
);

-- Add default items for pharmacy
INSERT INTO default_items (template_id, item_name, default_rate, category, sort_order)
VALUES 
    ((SELECT id FROM invoice_templates WHERE template_code = 'pharmacy'), 'Medicine', 150.00, 'Health', 1),
    ((SELECT id FROM invoice_templates WHERE template_code = 'pharmacy'), 'Consultation', 200.00, 'Service', 2);

-- Assign to a store
UPDATE megha_stores 
SET invoice_template_id = (SELECT id FROM invoice_templates WHERE template_code = 'pharmacy')
WHERE store_code = 'my-pharmacy';
```

## Frontend Integration

### **Invoice Component Updates**
```typescript
// Get store's template configuration
const template = await this.supabase.getStoreTemplate(storeCode);

// Get template's default items
const defaultItems = await this.supabase.getTemplateDefaultItems(template.id);

// Use template settings for invoice
this.invoiceForm.patchValue({
  invoicePrefix: template.invoice_prefix,
  taxRate: template.tax_rate,
  primaryColor: template.primary_color
});
```

### **Store Configuration**
```typescript
// When creating a new store
const newStore = {
  store_code: 'my-new-store',
  store_name: 'My New Store',
  invoice_template_id: templateId  // Reference to template
};
```

## Migration Process

### **Step 1: Backup Existing Data**
```sql
-- Backup old templates and items
CREATE TABLE invoice_templates_backup AS SELECT * FROM invoice_templates;
CREATE TABLE default_items_backup AS SELECT * FROM default_items;
```

### **Step 2: Apply New Schema**
```sql
-- Run the refactored schema
\i invoice-template-schema-refactored.sql
```

### **Step 3: Migrate Data**
```sql
-- Run the migration script
\i migrate-invoice-templates.sql
```

### **Step 4: Verify Migration**
```sql
-- Check template assignments
SELECT * FROM store_template_summary;

-- Test template functions
SELECT * FROM get_store_invoice_template('brew-buddy');
SELECT * FROM get_template_default_items(1);
```

## Benefits of New System

### ✅ **Reusability**
- Templates can be shared across multiple stores
- No duplicate template configurations
- Easy to maintain and update

### ✅ **Scalability**
- New stores automatically get appropriate templates
- Easy to add new template types
- Template changes affect all stores using that template

### ✅ **Flexibility**
- Custom templates can be created for specific needs
- System templates provide good defaults
- Easy to override template settings per store

### ✅ **Maintainability**
- Centralized template management
- Consistent invoice formatting across stores
- Easy to update tax rates, colors, etc.

## Template Management

### **System Templates**
- **Cannot be deleted** (`is_system_template = true`)
- **Provide defaults** for common business types
- **Auto-assigned** based on store code patterns

### **Custom Templates**
- **Can be deleted** (`is_system_template = false`)
- **Created by users** for specific business needs
- **Manually assigned** to stores

### **Template Hierarchy**
1. **Store-specific overrides** (highest priority)
2. **Template defaults** (medium priority)
3. **System defaults** (lowest priority)

## Troubleshooting

### **Store Has No Template**
```sql
-- Check if store has template assigned
SELECT s.store_code, it.template_name 
FROM megha_stores s 
LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id 
WHERE s.store_code = 'my-store';

-- Assign default template if missing
UPDATE megha_stores 
SET invoice_template_id = (SELECT id FROM invoice_templates WHERE template_code = 'retail')
WHERE store_code = 'my-store' AND invoice_template_id IS NULL;
```

### **Template Not Found**
```sql
-- Check if template exists
SELECT * FROM invoice_templates WHERE template_code = 'my-template';

-- Create template if missing
INSERT INTO invoice_templates (template_code, template_name) 
VALUES ('my-template', 'My Custom Template');
```

### **Default Items Missing**
```sql
-- Check template's default items
SELECT * FROM get_template_default_items(template_id);

-- Add default items
INSERT INTO default_items (template_id, item_name, default_rate, category)
VALUES (template_id, 'Default Item', 100.00, 'General');
```

## Best Practices

### **Template Design**
1. **Use descriptive template codes** (e.g., 'coffee', 'pharmacy')
2. **Provide meaningful descriptions** for template purpose
3. **Set appropriate tax rates** based on business type
4. **Choose suitable colors** that match business branding

### **Default Items**
1. **Include common items** for the business type
2. **Set realistic default rates** based on market prices
3. **Use proper categories** for better organization
4. **Order items logically** using sort_order

### **Store Assignment**
1. **Auto-assign based on store code** when possible
2. **Review assignments** after bulk imports
3. **Allow manual overrides** for special cases
4. **Document custom assignments** for future reference

This refactored template system provides a robust, scalable foundation for multi-store invoice management while maintaining simplicity and flexibility.

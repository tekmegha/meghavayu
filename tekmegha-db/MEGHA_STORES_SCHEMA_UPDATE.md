# Megha Stores Schema Update

## Overview
The `megha_stores` table has been updated with new columns to provide better control over store features and production readiness.

## New Schema Structure

### Core Columns
- `id` - UUID primary key
- `store_code` - Unique store identifier (VARCHAR(50))
- `store_name` - Display name (VARCHAR(255))
- `store_type` - Type of store (VARCHAR(100))
- `domain` - Store domain (VARCHAR(255))
- `theme_config` - JSONB theme configuration
- `business_hours` - JSONB business hours
- `contact_email` - Contact email (VARCHAR(255))
- `support_phone` - Support phone (VARCHAR(20))
- `is_active` - Store active status (BOOLEAN)

### New Feature Control Columns
- `enable_products` - Enable product management (BOOLEAN, default: true)
- `enable_cart` - Enable shopping cart (BOOLEAN, default: true)
- `enable_payments` - Enable payment processing (BOOLEAN, default: true)
- `enable_inventory` - Enable inventory management (BOOLEAN, default: true)
- `enable_invoices` - Enable invoice generation (BOOLEAN, default: true)
- `enable_customers` - Enable customer management (BOOLEAN, default: true)
- `enable_reports` - Enable reporting features (BOOLEAN, default: true)

### Production Control
- `is_prod_ready` - Production readiness flag (BOOLEAN, default: false)
- `invoice_template_id` - Foreign key to invoice templates (BIGINT)

### Timestamps
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp (auto-updated via trigger)

## Indexes
- `idx_megha_stores_code` - On store_code
- `idx_megha_stores_active` - On is_active
- `idx_megha_stores_type` - On store_type

## Usage Examples

### Creating a New Store
```sql
INSERT INTO megha_stores (
  store_code,
  store_name,
  store_type,
  domain,
  theme_config,
  business_hours,
  contact_email,
  support_phone,
  is_active,
  enable_products,
  enable_cart,
  enable_payments,
  enable_inventory,
  enable_invoices,
  enable_customers,
  enable_reports,
  is_prod_ready
) VALUES (
  'my-store',
  'My Store',
  'retail',
  'my-store.com',
  '{"primaryColor": "#3b82f6"}',
  '{"monday": {"open": "09:00", "close": "18:00"}}',
  'info@my-store.com',
  '1234567890',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  false
);
```

### Updating Store Features
```sql
UPDATE megha_stores 
SET 
  enable_payments = false,
  enable_inventory = false,
  is_prod_ready = true
WHERE store_code = 'my-store';
```

### Querying Active Stores with Specific Features
```sql
SELECT 
  store_code,
  store_name,
  store_type,
  enable_products,
  enable_cart,
  enable_payments,
  is_prod_ready
FROM megha_stores 
WHERE is_active = true 
  AND enable_products = true 
  AND enable_cart = true;
```

## Migration Notes

### For Existing Stores
If you have existing stores, you may need to update them with the new columns:

```sql
-- Update existing stores to enable all features by default
UPDATE megha_stores 
SET 
  enable_products = COALESCE(enable_products, true),
  enable_cart = COALESCE(enable_cart, true),
  enable_payments = COALESCE(enable_payments, true),
  enable_inventory = COALESCE(enable_inventory, true),
  enable_invoices = COALESCE(enable_invoices, true),
  enable_customers = COALESCE(enable_customers, true),
  enable_reports = COALESCE(enable_reports, true),
  is_prod_ready = COALESCE(is_prod_ready, false);
```

## Benefits

1. **Granular Control**: Enable/disable specific features per store
2. **Production Safety**: Use `is_prod_ready` to control which stores are production-ready
3. **Template Integration**: Link stores to specific invoice templates
4. **Performance**: Indexes on commonly queried columns
5. **Flexibility**: JSONB columns for flexible configuration

## Related Files
- `paws-nexus-complete-setup.sql` - Complete setup for Paws Nexus store
- `insert-paws-nexus-store.sql` - Fixed version of the original insert script

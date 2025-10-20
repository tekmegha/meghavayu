# Missing Columns Analysis for Invoice Functionality

## Overview
Analysis of the `megha_stores` table to identify missing columns required for proper invoice functionality.

## Missing Columns Identified

### 1. **Business Information Columns**
- `description` (TEXT) - Store description and additional information
- `address` (TEXT) - Physical address of the store
- `city` (VARCHAR(100)) - City where the store is located
- `state` (VARCHAR(100)) - State where the store is located
- `postal_code` (VARCHAR(20)) - Postal/ZIP code of the store
- `country` (VARCHAR(100)) - Country where the store is located (default: India)

### 2. **Tax and Legal Information**
- `tax_id` (VARCHAR(50)) - GST number or tax identification number
- `pan_number` (VARCHAR(20)) - PAN number for tax purposes
- `business_registration_number` (VARCHAR(100)) - Business registration number

### 3. **Feature Management**
- `features` (JSONB) - JSON object defining enabled features like inventory, delivery, multiStore, etc.
- `social_links` (JSONB) - JSON object with social media URLs
- `settings` (JSONB) - JSON object for store-specific settings and configurations

### 4. **Invoice-Specific Columns**
- `invoice_template_id` (BIGINT) - Reference to invoice template for this store
- `enable_products` (BOOLEAN) - Whether product management is enabled for this store
- `enable_cart` (BOOLEAN) - Whether shopping cart is enabled for this store
- `enable_payments` (BOOLEAN) - Whether payment processing is enabled for this store
- `enable_inventory` (BOOLEAN) - Whether inventory management is enabled for this store
- `enable_invoices` (BOOLEAN) - Whether invoice generation is enabled for this store
- `enable_customers` (BOOLEAN) - Whether customer management is enabled for this store
- `enable_reports` (BOOLEAN) - Whether reporting is enabled for this store

### 5. **Status and Verification**
- `is_verified` (BOOLEAN) - Whether the store has been verified
- `is_prod_ready` (BOOLEAN) - Whether the store is ready for production use
- `deleted_at` (TIMESTAMP WITH TIME ZONE) - Soft delete timestamp

## Files Created/Updated

### 1. **Migration Script**
- **File**: `add-missing-invoice-columns.sql`
- **Purpose**: Adds all missing columns to existing `megha_stores` table
- **Features**:
  - Safe column addition with `IF NOT EXISTS`
  - Foreign key constraint for `invoice_template_id`
  - Indexes for better query performance
  - Default values for existing records
  - Verification queries

### 2. **Updated Schema**
- **File**: `megha-stores-schema.sql`
- **Purpose**: Updated main schema file with all required columns
- **Features**:
  - Complete column definitions
  - Foreign key constraints
  - Indexes for performance
  - Comprehensive documentation
  - Example JSON structures

## Key Benefits

### 1. **Invoice Functionality**
- Complete store information for invoice headers
- Tax information for GST calculations
- Template association for consistent invoice formatting
- Feature toggles for invoice management

### 2. **Business Management**
- Complete business registration details
- Social media integration
- Store-specific settings
- Production readiness tracking

### 3. **Performance Optimization**
- Strategic indexes for common queries
- Efficient foreign key relationships
- Optimized data types

### 4. **Data Integrity**
- Proper constraints and validations
- Foreign key relationships
- Default values for consistency

## Implementation Steps

### 1. **Run Migration Script**
```sql
-- Execute the migration script
\i add-missing-invoice-columns.sql
```

### 2. **Verify Column Addition**
```sql
-- Check if all columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'megha_stores' 
AND table_schema = 'public'
ORDER BY ordinal_position;
```

### 3. **Update Existing Records**
```sql
-- Set default values for existing stores
UPDATE megha_stores 
SET 
    country = 'India',
    enable_products = true,
    enable_cart = true,
    enable_payments = true,
    enable_inventory = true,
    enable_invoices = true,
    enable_customers = true,
    enable_reports = true,
    is_verified = false,
    is_prod_ready = false
WHERE country IS NULL;
```

## Example JSON Structures

### Features JSON
```json
{
  "inventory": true,
  "delivery": true,
  "multiStore": true,
  "userRoles": true,
  "payment": true,
  "analytics": true,
  "loyaltyProgram": false
}
```

### Social Links JSON
```json
{
  "facebook": "https://facebook.com/storename",
  "instagram": "https://instagram.com/storename",
  "twitter": "https://twitter.com/storename",
  "linkedin": "https://linkedin.com/company/storename",
  "youtube": "https://youtube.com/@storename"
}
```

### Settings JSON
```json
{
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "dateFormat": "DD/MM/YYYY",
  "numberFormat": "Indian",
  "taxInclusive": true,
  "autoGenerateInvoiceNumber": true,
  "invoicePrefix": "INV",
  "defaultPaymentMode": "Cash"
}
```

## Conclusion

The analysis identified **20 missing columns** that are essential for proper invoice functionality. The migration script and updated schema provide a complete solution for adding these columns safely while maintaining data integrity and performance.

All columns have been properly documented with comments, indexes, and constraints to ensure optimal database performance and maintainability.

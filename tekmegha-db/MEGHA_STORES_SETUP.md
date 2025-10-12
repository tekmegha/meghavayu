# Megha Stores - Database Setup Guide

## Overview

The `megha_stores` table is the master registry for all TekMegha store brands. It centralizes store configuration, branding, business hours, and settings.

## Quick Setup

### 1. Create the Schema

```bash
psql -U postgres -d tekmegha -f tekmegha-db/megha-stores-schema.sql
```

### 2. Insert All Stores

```bash
psql -U postgres -d tekmegha -f tekmegha-db/insert-all-stores.sql
```

Or insert individual stores:
```bash
# Insert Royal Foods
psql -U postgres -d tekmegha -f tekmegha-db/insert-royalfoods-store.sql

# Insert DK Associates
psql -U postgres -d tekmegha -f tekmegha-db/insert-dkassociates-store.sql
```

## Table Structure

### Core Fields

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `store_code` | VARCHAR(50) | Unique store identifier (e.g., brewbuddy, dkassociates) |
| `store_name` | VARCHAR(255) | Display name of the store |
| `store_type` | VARCHAR(100) | Store category (coffee, toys, fashion, digitalsecurity, food, insurance) |
| `domain` | VARCHAR(255) | Store domain name |
| `theme_config` | JSONB | Theme colors, logo, layout configuration |
| `business_hours` | JSONB | Operating hours for each day |
| `contact_email` | VARCHAR(255) | Store contact email |
| `support_phone` | VARCHAR(20) | Support phone number |
| `is_active` | BOOLEAN | Whether store is active |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp (auto-updated) |

### Additional Fields

- `description`: Store description
- `address`, `city`, `state`, `postal_code`, `country`: Physical location
- `tax_id`, `pan_number`, `business_registration_number`: Tax and legal info
- `features`: JSONB for enabled features
- `social_links`: JSONB for social media URLs
- `settings`: JSONB for store-specific settings
- `is_verified`: Verification status
- `deleted_at`: Soft delete timestamp

## Store Types

| Type | Description | Example Store |
|------|-------------|---------------|
| `coffee` | Coffee shops and cafes | BrewBuddy |
| `toys` | Toy stores | Little Ducks |
| `fashion` | Fashion and apparel | Majili |
| `digitalsecurity` | Security systems | CCTV Device |
| `food` | Food businesses | Royal Foods |
| `insurance` | Insurance services | DK Associates |

## Current Stores

### 1. BrewBuddy (Coffee)
- **Code**: `brewbuddy`
- **Type**: coffee
- **Domain**: brewbuddy.com
- **Hours**: 7 AM - 10 PM (extended on Fri/Sat)

### 2. Little Ducks (Toys)
- **Code**: `littleducks`
- **Type**: toys
- **Domain**: littleducks.com
- **Hours**: 10 AM - 8 PM (9 PM on Fri/Sat)

### 3. Majili (Fashion)
- **Code**: `majili`
- **Type**: fashion
- **Domain**: majili.com
- **Hours**: 10 AM - 9 PM (10 PM on Fri/Sat)

### 4. CCTV Device (Digital Security)
- **Code**: `cctv-device`
- **Type**: digitalsecurity
- **Domain**: cctvdevice.com
- **Hours**: 9 AM - 7 PM (closed Sunday)

### 5. Royal Foods (Food)
- **Code**: `royalfoods`
- **Type**: food
- **Domain**: royalfoods.com
- **Hours**: 11 AM - 11 PM (extended on Fri/Sat)

### 6. DK Associates (Automobile Insurance)
- **Code**: `dkassociates`
- **Type**: insurance
- **Domain**: dkassociates.com
- **Hours**: 9 AM - 6 PM Mon-Fri, 9 AM - 2 PM Sat (closed Sunday)

## Theme Configuration

### Example theme_config JSON:

```json
{
  "primaryColor": "#0891b2",
  "secondaryColor": "#06b6d4",
  "accentColor": "#14b8a6",
  "warningColor": "#f59e0b",
  "dangerColor": "#dc2626",
  "backgroundColor": "#f0fdfa",
  "surfaceColor": "#ffffff",
  "textPrimary": "#1f2937",
  "textSecondary": "#6b7280",
  "fontFamily": "Inter, sans-serif",
  "logo": "assets/images/dkassociates/logo.png",
  "layout": "layout-insurance"
}
```

## Business Hours Configuration

### Example business_hours JSON:

```json
{
  "monday": {"open": "09:00", "close": "18:00"},
  "tuesday": {"open": "09:00", "close": "18:00"},
  "wednesday": {"open": "09:00", "close": "18:00"},
  "thursday": {"open": "09:00", "close": "18:00"},
  "friday": {"open": "09:00", "close": "18:00"},
  "saturday": {"open": "09:00", "close": "14:00"},
  "sunday": {"open": null, "close": null, "closed": true}
}
```

## Features Configuration

### Example features JSON:

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

## Common Queries

### Get all active stores
```sql
SELECT * FROM megha_stores WHERE is_active = true;
```

### Get stores by type
```sql
SELECT store_code, store_name 
FROM megha_stores 
WHERE store_type = 'insurance';
```

### Get store configuration
```sql
SELECT store_code, store_name, theme_config, business_hours 
FROM megha_stores 
WHERE store_code = 'dkassociates';
```

### Get stores open on Sunday
```sql
SELECT store_code, store_name 
FROM megha_stores 
WHERE business_hours->'sunday'->>'closed' IS NULL 
   OR business_hours->'sunday'->>'closed' = 'false';
```

### Update store theme
```sql
UPDATE megha_stores 
SET theme_config = jsonb_set(
  theme_config, 
  '{primaryColor}', 
  '"#new-color"'
)
WHERE store_code = 'dkassociates';
```

### Deactivate a store
```sql
UPDATE megha_stores 
SET is_active = false, updated_at = NOW() 
WHERE store_code = 'storecode';
```

### Soft delete a store
```sql
UPDATE megha_stores 
SET deleted_at = NOW(), is_active = false 
WHERE store_code = 'storecode';
```

## Adding a New Store

### Step 1: Add to Database

```sql
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain,
  theme_config, business_hours, contact_email, support_phone,
  is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'New Store Name',
  'newstore',
  'store_type',
  'newstore.com',
  '{ /* theme config */ }'::jsonb,
  '{ /* business hours */ }'::jsonb,
  'info@newstore.com',
  '+91-1234567890',
  true,
  NOW(),
  NOW()
);
```

### Step 2: Add to Brand Service

Update `tekmegha-fe/src/app/shared/services/brand.service.ts`:

```typescript
{
  id: 'newstore',
  name: 'newstore',
  displayName: 'New Store Name',
  // ... rest of configuration
}
```

### Step 3: Add Routes

Update `tekmegha-fe/src/app/app.routes.ts`:

```typescript
{ path: 'newstore', component: DynamicLayoutComponent, children: [
  // ... child routes
]},
```

### Step 4: Create Content JSON

Create `tekmegha-fe/src/assets/newstore-content.json`

### Step 5: Add Images

Create directory: `tekmegha-fe/src/assets/images/newstore/`

## Automated Features

### Auto-Update Timestamp
The `updated_at` field is automatically updated on every UPDATE operation via trigger.

### Indexes
Optimized indexes on:
- `store_code` (unique)
- `store_type`
- `is_active`
- `domain`

## Integration with Frontend

### Store Selector
The store selector component reads from this table to display available stores.

### Brand Detection
The brand service uses `store_code` to match and apply the correct theme and configuration.

### Dynamic Routing
Routes are dynamically generated based on `store_code`.

## Backup & Restore

### Backup single table
```bash
pg_dump -U postgres -d tekmegha -t megha_stores > megha_stores_backup.sql
```

### Restore
```bash
psql -U postgres -d tekmegha < megha_stores_backup.sql
```

## Troubleshooting

### Issue: Store not appearing in selector
**Solution**: Check `is_active` status and verify insertion.

### Issue: Theme not applying
**Solution**: Verify `theme_config` JSON is valid and contains all required fields.

### Issue: Business hours not displaying correctly
**Solution**: Ensure `business_hours` JSON follows the correct format.

### Issue: Duplicate store_code error
**Solution**: Store codes must be unique. Choose a different code or update existing.

## Security Considerations

1. **Row Level Security**: Enable RLS if using Supabase
2. **Access Control**: Restrict direct table access
3. **Validation**: Validate JSON fields before insertion
4. **Audit Trail**: Track who creates/updates stores
5. **Soft Delete**: Use `deleted_at` instead of hard deletes

## Performance Tips

1. Use indexes for frequently queried columns
2. Keep JSONB fields reasonable in size
3. Use JSONB operators for efficient queries
4. Cache store data in frontend applications
5. Monitor query performance regularly

## Related Tables

- `store_locations`: Physical locations for each store
- `products`: Products associated with each store
- `location_inventory`: Inventory per location
- `orders`: Orders per store

## Version History

- **v1.0** (October 2024) - Initial schema with 6 stores
  - BrewBuddy (Coffee)
  - Little Ducks (Toys)
  - Majili (Fashion)
  - CCTV Device (Digital Security)
  - Royal Foods (Food)
  - DK Associates (Insurance)

---

**Last Updated**: October 12, 2024


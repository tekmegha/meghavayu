# Invoice System Routing Setup

## Overview
The invoice system now supports **all stores** in the database, regardless of whether they have dedicated routes or not. This ensures that any store can access inventory management features including invoice creation.

## Routing Structure

### 1. Global Routes (Available to All Stores)
```
/inventory-login     - Inventory staff login
/inventory          - Inventory management (requires auth)
/invoice            - Invoice creation (requires auth)
```

### 2. Store-Specific Routes (Existing Stores)
```
/brew-buddy/invoice
/little-ducks/invoice
/majili/invoice
/cctv-device/invoice
/royalfoods/invoice
/automobile-insurance/invoice
/dkassociates/invoice
```

### 3. Wildcard Routes (New/Any Store)
```
/:storeCode/invoice    - Any store from database
/:storeCode/inventory  - Any store from database
/:storeCode/home       - Any store from database
/:storeCode/menu       - Any store from database
```

## How It Works

### For Stores WITH Dedicated Routes:
- **Access**: `/store-code/invoice` or `/invoice`
- **Example**: `/brew-buddy/invoice` or `/invoice`
- **Store Detection**: Automatic via route parameter or URL path

### For Stores WITHOUT Dedicated Routes:
- **Access**: `/store-code/invoice` (where store-code is from database)
- **Example**: `/new-store-123/invoice`
- **Store Detection**: Via wildcard route parameter

### Store Detection Logic:
1. **Route Parameter**: Checks `:storeCode` parameter first
2. **URL Path**: Falls back to hardcoded path detection
3. **Database Validation**: Validates store exists in `megha_stores` table
4. **Default Layout**: Uses appropriate layout based on store type

## Database Requirements

### Store Table Structure:
```sql
CREATE TABLE megha_stores (
    id BIGSERIAL PRIMARY KEY,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    store_type VARCHAR(100),
    theme JSONB,
    is_active BOOLEAN DEFAULT true,
    -- ... other fields
);
```

### Invoice Table Structure:
```sql
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    store_id BIGINT NOT NULL REFERENCES megha_stores(id),
    -- ... invoice fields
);
```

## Authentication Flow

### 1. Inventory Login Process:
```
User → /inventory-login → Authentication → /invoice
```

### 2. Store-Specific Access:
```
User → /store-code/inventory-login → Authentication → /store-code/invoice
```

### 3. Direct Access (If Already Authenticated):
```
User → /invoice or /store-code/invoice → Invoice Component
```

## Store Configuration

### Default Items by Store Type:
- **Brew Buddy**: Coffee beans, espresso, cappuccino
- **Auto Insurance**: Motor policies, road tax, registration fees
- **Royal Foods**: Rice, wheat flour, cooking oil
- **DK Associates**: Insurance policies, processing fees, documentation
- **Default**: Milk, bread, coffee

### Layout Selection:
- **Default Layout**: Brew Buddy, Insurance stores, new stores
- **Fashion Layout**: Majili stores
- **Toys Layout**: Little Ducks stores
- **Food Layout**: Royal Foods stores
- **Digital Security Layout**: CCTV Device stores

## Usage Examples

### Adding a New Store:
1. **Insert into Database**:
```sql
INSERT INTO megha_stores (store_code, store_name, store_type, theme, is_active)
VALUES ('new-store', 'New Store Name', 'retail', '{"primaryColor": "#dc2626"}', true);
```

2. **Access Invoice System**:
```
https://yourdomain.com/new-store/invoice
```

3. **Login with Inventory Credentials**:
```
https://yourdomain.com/new-store/inventory-login
```

### Existing Store Access:
```
https://yourdomain.com/brew-buddy/invoice
https://yourdomain.com/dkassociates/invoice
https://yourdomain.com/invoice (global access)
```

## Security Features

### Authentication Guards:
- **InventoryAuthGuard**: Protects `/invoice` and `/inventory` routes
- **CustomerAuthGuard**: Protects customer-specific routes like `/insurances`

### Store Validation:
- All store codes are validated against the database
- Invalid store codes redirect to store selector
- Inactive stores are automatically excluded

## Benefits

### ✅ Universal Access:
- Any store in the database can access invoice system
- No need to add routes for new stores
- Automatic store detection and configuration

### ✅ Flexible Routing:
- Global routes work for all stores
- Store-specific routes for branded experiences
- Wildcard routes for dynamic store access

### ✅ Consistent Experience:
- Same invoice functionality across all stores
- Store-specific default items and configurations
- Appropriate layouts based on store type

## Troubleshooting

### Store Not Found Error:
- Check if store exists in `megha_stores` table
- Verify `store_code` matches exactly
- Ensure store is marked as `is_active = true`

### Authentication Issues:
- Verify user has inventory role for the store
- Check `user_roles` table for proper permissions
- Ensure inventory login credentials are correct

### Layout Issues:
- Check store theme configuration in database
- Verify layout components are properly imported
- Ensure store type matches layout selection logic

## Future Enhancements

### Planned Features:
- Store-specific invoice templates
- Custom tax rates per store
- Multi-location support
- Advanced reporting per store
- Bulk invoice operations
- Integration with external accounting systems

This setup ensures that the invoice system is truly universal and can serve any store added to the database without requiring code changes or new route definitions.

# Royal Foods Store Update

## 🎯 **Overview**

Successfully created SQL script to update Royal Foods store details with new contact information and address.

## 📋 **Store Information**

### **Store Details:**
- **Store ID:** `26d71c6f-eac6-4696-bb75-a3a80a9e2e65`
- **Phone Number:** `8500961396`
- **Email:** `royalfood530012@gmail.com`
- **Address:** `Sheelanagar, Visakhapatnam, Andhra Pradesh`
- **City:** `Visakhapatnam`
- **State:** `Andhra Pradesh`
- **Postal Code:** `530012`

## 🔧 **SQL Update Script**

**File:** `tekmegha-db/update-royalfoods-store-details.sql`

### **Main Update Query:**
```sql
UPDATE megha_stores 
SET 
  support_phone = '8500961396',
  contact_email = 'royalfood530012@gmail.com',
  address = 'Sheelanagar, Visakhapatnam, Andhrapradesh',
  city = 'Visakhapatnam',
  state = 'Andhra Pradesh',
  postal_code = '530012',
  updated_at = NOW()
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

### **Verification Query:**
```sql
SELECT 
  store_code,
  store_name,
  support_phone,
  contact_email,
  address,
  city,
  state,
  postal_code,
  updated_at
FROM megha_stores 
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

## 📊 **Updated Fields**

| Field | Old Value | New Value |
|-------|-----------|-----------|
| `support_phone` | (Previous) | `8500961396` |
| `contact_email` | (Previous) | `royalfood530012@gmail.com` |
| `address` | (Previous) | `Sheelanagar, Visakhapatnam, Andhrapradesh` |
| `city` | (Previous) | `Visakhapatnam` |
| `state` | (Previous) | `Andhra Pradesh` |
| `postal_code` | (Previous) | `530012` |
| `updated_at` | (Previous) | `NOW()` |

## 🧪 **Testing Queries**

### **1. Verify Store Exists:**
```sql
SELECT 
  id,
  store_code,
  store_name,
  store_type,
  is_active
FROM megha_stores 
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

### **2. Check Contact Information:**
```sql
SELECT 
  store_name,
  support_phone,
  contact_email,
  address,
  city,
  state,
  postal_code
FROM megha_stores 
WHERE store_code = 'royalfoods';
```

### **3. Verify Update Success:**
```sql
SELECT 
  store_code,
  store_name,
  support_phone,
  contact_email,
  address,
  city,
  state,
  postal_code,
  updated_at
FROM megha_stores 
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

## 📝 **Additional Features**

### **Business Hours Update (Optional):**
```sql
UPDATE megha_stores 
SET business_hours = '{
  "monday": {"open": "09:00", "close": "21:00"},
  "tuesday": {"open": "09:00", "close": "21:00"},
  "wednesday": {"open": "09:00", "close": "21:00"},
  "thursday": {"open": "09:00", "close": "21:00"},
  "friday": {"open": "09:00", "close": "21:00"},
  "saturday": {"open": "09:00", "close": "21:00"},
  "sunday": {"open": "10:00", "close": "20:00"}
}'::jsonb
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

### **Social Links Update (Optional):**
```sql
UPDATE megha_stores 
SET social_links = '{
  "facebook": "https://facebook.com/royalfoods",
  "instagram": "https://instagram.com/royalfoods",
  "whatsapp": "https://wa.me/918500961396"
}'::jsonb
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
```

## 🎯 **Benefits**

### **1. Updated Contact Information**
- **Phone number** updated for customer support
- **Email address** updated for business communications
- **Address** updated with correct location details

### **2. Improved Store Data**
- **City and state** properly set for location-based features
- **Postal code** added for delivery and shipping calculations
- **Timestamp** updated to reflect the change

### **3. Better Customer Experience**
- **Accurate contact details** for customer inquiries
- **Correct address** for delivery and pickup services
- **Updated information** in store listings and profiles

## 🚀 **Next Steps**

1. **Run the SQL script** to update the store details
2. **Verify the update** using the verification queries
3. **Test the store** to ensure contact information is displayed correctly
4. **Update any frontend components** that display store information
5. **Test customer-facing features** like contact forms and delivery

## 🎉 **Status**

The Royal Foods store update script has been created and is ready to be executed! The script will update the store's contact information, address, and location details. ✅

## 📋 **Manual Execution**

To run the update manually:

1. **Connect to the database:**
   ```bash
   psql -h localhost -U postgres -d tekmegha
   ```

2. **Run the update script:**
   ```sql
   \i update-royalfoods-store-details.sql
   ```

3. **Verify the update:**
   ```sql
   SELECT store_code, store_name, support_phone, contact_email, address 
   FROM megha_stores 
   WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';
   ```

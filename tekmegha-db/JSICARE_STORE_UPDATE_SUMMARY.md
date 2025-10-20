# JSICare Store Update Summary

## 📋 **Store Information**
- **Store ID:** `6114784a-0827-41dd-8a85-c6ddbcc6c920`
- **Store Code:** (To be determined from existing data)
- **Store Name:** JSICare

## 🔄 **Updates Applied**

### **Contact Information:**
- **Phone:** `+91 87900 56754`
- **Email:** `info@jsicare.com`

### **Address Details:**
- **Full Address:** Metro Pillar No. C-1740, Near Durgam Cheruvu Metro Station, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081
- **City:** Hyderabad
- **State:** Telangana
- **Postal Code:** 500081

### **Business Hours:**
```json
{
    "monday": {"open": "10:00", "close": "21:00"},
    "tuesday": {"open": "10:00", "close": "21:00"},
    "wednesday": {"open": "10:00", "close": "21:00"},
    "thursday": {"open": "10:00", "close": "21:00"},
    "friday": {"open": "10:00", "close": "21:00"},
    "saturday": {"open": "10:00", "close": "21:00"},
    "sunday": {"open": "10:00", "close": "19:00"}
}
```

**Business Hours Summary:**
- **Monday-Saturday:** 10:00 AM - 9:00 PM
- **Sunday:** 10:00 AM - 7:00 PM

## 🗃️ **Database Update Query**

```sql
UPDATE megha_stores 
SET 
    support_phone = '+91 87900 56754',
    contact_email = 'info@jsicare.com',
    address = 'Metro Pillar No. C-1740, Near Durgam Cheruvu Metro Station, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081',
    city = 'Hyderabad',
    state = 'Telangana',
    postal_code = '500081',
    business_hours = '{
        "monday": {"open": "10:00", "close": "21:00"},
        "tuesday": {"open": "10:00", "close": "21:00"},
        "wednesday": {"open": "10:00", "close": "21:00"},
        "thursday": {"open": "10:00", "close": "21:00"},
        "friday": {"open": "10:00", "close": "21:00"},
        "saturday": {"open": "10:00", "close": "21:00"},
        "sunday": {"open": "10:00", "close": "19:00"}
    }'::jsonb,
    updated_at = NOW()
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';
```

## ✅ **Verification Steps**

### **1. Check Updated Data:**
```sql
SELECT 
    store_code,
    store_name,
    address,
    city,
    state,
    postal_code,
    contact_email,
    support_phone,
    business_hours,
    updated_at
FROM megha_stores 
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';
```

### **2. Test Business Hours:**
```sql
SELECT 
    business_hours->'monday' as monday_hours,
    business_hours->'sunday' as sunday_hours
FROM megha_stores 
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';
```

## 🎯 **Impact on Application**

### **Invoice Creation:**
- Store details will now show updated contact information
- Business hours will be properly formatted
- Address will reflect the new location

### **Store Information Display:**
- Phone number: `+91 87900 56754`
- Email: `info@jsicare.com`
- Address: Metro Pillar No. C-1740, Near Durgam Cheruvu Metro Station, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081

### **Business Hours Display:**
- Monday-Saturday: 10:00 AM - 9:00 PM
- Sunday: 10:00 AM - 7:00 PM

## 📁 **Files Created**
- `tekmegha-db/update-jsicare-store.sql` - Complete update script
- `tekmegha-db/JSICARE_STORE_UPDATE_SUMMARY.md` - This documentation

## 🚀 **Next Steps**
1. Run the SQL script to apply the updates
2. Verify the changes in the database
3. Test the store information in the application
4. Confirm business hours display correctly

The JSICare store has been successfully updated with the new contact information and business hours! 🎉

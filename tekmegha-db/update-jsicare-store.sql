-- ============================================
-- Update JSICare Store Details
-- Store ID: 6114784a-0827-41dd-8a85-c6ddbcc6c920
-- ============================================

-- First, check current JSICare store data
SELECT 
    'Current JSICare Store Data' as check_type,
    id,
    store_code,
    store_name,
    store_type,
    address,
    city,
    state,
    postal_code,
    contact_email,
    support_phone,
    business_hours,
    is_active,
    is_verified,
    is_prod_ready
FROM megha_stores 
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';

-- Update JSICare store with new details
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

-- Verify the update was successful
SELECT 
    'Updated JSICare Store Data' as check_type,
    id,
    store_code,
    store_name,
    store_type,
    address,
    city,
    state,
    postal_code,
    contact_email,
    support_phone,
    business_hours,
    is_active,
    is_verified,
    is_prod_ready,
    updated_at
FROM megha_stores 
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';

-- Test the business hours JSON structure
SELECT 
    'Business Hours Test' as check_type,
    business_hours->'monday' as monday_hours,
    business_hours->'sunday' as sunday_hours,
    business_hours->'tuesday' as tuesday_hours
FROM megha_stores 
WHERE id = '6114784a-0827-41dd-8a85-c6ddbcc6c920';

-- ============================================
-- Update Summary:
-- ============================================
-- Store ID: 6114784a-0827-41dd-8a85-c6ddbcc6c920
-- Phone: +91 87900 56754
-- Email: info@jsicare.com
-- Address: Metro Pillar No. C-1740, Near Durgam Cheruvu Metro Station, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081
-- Business Hours: Mon-Sat: 10:00 AM - 9:00 PM, Sun: 10:00 AM - 7:00 PM
-- ============================================

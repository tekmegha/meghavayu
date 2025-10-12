-- ============================================
-- Data Import Template for Automobile Insurance
-- ============================================
-- Use this template to convert your Excel/CSV data into SQL INSERT statements
-- 
-- Excel Column Mapping:
-- POLICY ISSUE DATE → policy_issue_date
-- EXP DATE → expiry_date
-- WHO ISSUED POLICY → issued_by
-- NAME → customer_name
-- VEHICLE TYPE → vehicle_type
-- TYPE → policy_type
-- VEHICLE NO → vehicle_no
-- POLICY NO → policy_no
-- OD → od_premium
-- NET → net_premium
-- GROSS → gross_premium
-- REFERENCE → reference_1
-- REFERENCE 2 → reference_2
-- MB NO → mb_no
-- MAIL ID → email
-- PAYMENT MODE → payment_mode
-- COMPANY → insurance_company
-- CC/GVW/SEATING → cc_gvw_seating
-- REMARK → remarks
-- ============================================

-- Example: Converting the provided sample data
-- 
-- Original Excel Row:
-- 5/1/2022 | 5/2/2023 | SHIVARAM | KARIVEDA SAGAR REDDY | CB SHINE | TW SOD | TS08GJ6784 | VA136853 | 
-- 196 | 196 | 231 | CRR | SATHISH ANNA | | | ONLINE PAYMENT | FUTURE | 125 |
--
-- Converted SQL:

-- TEMPLATE - Copy and modify for each row
INSERT INTO insurance_policies (
    policy_no,              -- From: POLICY NO
    policy_issue_date,      -- From: POLICY ISSUE DATE (convert DD/MM/YYYY to YYYY-MM-DD)
    expiry_date,            -- From: EXP DATE (convert DD/MM/YYYY to YYYY-MM-DD)
    issued_by,              -- From: WHO ISSUED POLICY
    customer_name,          -- From: NAME
    vehicle_type,           -- From: VEHICLE TYPE
    policy_type,            -- From: TYPE
    vehicle_no,             -- From: VEHICLE NO
    od_premium,             -- From: OD
    net_premium,            -- From: NET
    gross_premium,          -- From: GROSS
    reference_1,            -- From: REFERENCE
    reference_2,            -- From: REFERENCE 2
    mb_no,                  -- From: MB NO (can be NULL)
    email,                  -- From: MAIL ID (can be NULL)
    payment_mode,           -- From: PAYMENT MODE
    insurance_company,      -- From: COMPANY
    cc_gvw_seating,        -- From: CC/GVW/SEATING
    remarks,               -- From: REMARK (can be NULL)
    status                 -- Set based on expiry_date (if expired: 'expired', else: 'active')
) VALUES (
    'VA136853',            -- policy_no
    '2022-05-01',         -- policy_issue_date (5/1/2022 → 2022-05-01)
    '2023-05-02',         -- expiry_date (5/2/2023 → 2023-05-02)
    'SHIVARAM',           -- issued_by
    'KARIVEDA SAGAR REDDY', -- customer_name
    'CB SHINE',           -- vehicle_type
    'TW SOD',             -- policy_type
    'TS08GJ6784',         -- vehicle_no
    196.00,               -- od_premium
    196.00,               -- net_premium
    231.00,               -- gross_premium
    'CRR',                -- reference_1
    'SATHISH ANNA',       -- reference_2
    NULL,                 -- mb_no (empty in Excel)
    NULL,                 -- email (empty in Excel)
    'ONLINE PAYMENT',     -- payment_mode
    'FUTURE',             -- insurance_company
    '125',                -- cc_gvw_seating
    NULL,                 -- remarks (empty in Excel)
    'expired'             -- status (date check: 2023-05-02 < today → expired)
);

-- ============================================
-- BULK INSERT TEMPLATE
-- ============================================
-- For importing multiple rows at once, use this format:

INSERT INTO insurance_policies (
    policy_no, policy_issue_date, expiry_date, issued_by, customer_name,
    vehicle_type, policy_type, vehicle_no, od_premium, net_premium,
    gross_premium, reference_1, reference_2, mb_no, email,
    payment_mode, insurance_company, cc_gvw_seating, remarks, status
) VALUES 
-- Row 1
('POLICY001', '2024-01-15', '2025-01-15', 'AGENT_NAME', 'CUSTOMER_NAME',
 'VEHICLE_MODEL', 'POLICY_TYPE', 'REG_NO', 1000.00, 5000.00,
 5900.00, 'REF1', 'REF2', NULL, 'email@example.com',
 'PAYMENT_MODE', 'COMPANY_CODE', '125CC', NULL, 'active'),

-- Row 2
('POLICY002', '2024-02-20', '2025-02-20', 'AGENT_NAME', 'CUSTOMER_NAME',
 'VEHICLE_MODEL', 'POLICY_TYPE', 'REG_NO', 1500.00, 6000.00,
 7080.00, 'REF1', 'REF2', '9876543210', 'email@example.com',
 'PAYMENT_MODE', 'COMPANY_CODE', '150CC', 'Some remarks', 'active');

-- Add more rows separated by commas
-- End with semicolon after last row

-- ============================================
-- DATE CONVERSION REFERENCE
-- ============================================
-- Excel Date Format: DD/MM/YYYY (e.g., 5/1/2022 = 5th January 2022)
-- SQL Date Format: YYYY-MM-DD (e.g., 2022-01-05)
--
-- Common conversions:
-- 5/1/2022 (5th Jan) → '2022-01-05'
-- 15/3/2023 (15th Mar) → '2023-03-15'
-- 1/12/2024 (1st Dec) → '2024-12-01'

-- ============================================
-- POLICY TYPE CODES
-- ============================================
-- TW SOD = Two Wheeler - Stand Alone Own Damage
-- TW TP = Two Wheeler - Third Party
-- TW FULL = Two Wheeler - Comprehensive
-- GCV FULL = Goods Carrier Vehicle - Comprehensive
-- PCV FULL = Passenger Carrier Vehicle - Comprehensive
-- CAR FULL = Private Car - Comprehensive
-- CAR TP = Private Car - Third Party

-- ============================================
-- INSURANCE COMPANY CODES
-- ============================================
-- Use these standard codes:
-- DIGIT, FUTURE, HDFC, ICICI, BAJAJ, SBI, TATA, RELIANCE

-- ============================================
-- STATUS DETERMINATION
-- ============================================
-- If expiry_date < CURRENT_DATE → 'expired'
-- If expiry_date >= CURRENT_DATE → 'active'
-- If policy was cancelled → 'cancelled'
-- If renewed with new policy → 'renewed'

-- ============================================
-- TIPS FOR BULK IMPORT
-- ============================================
-- 1. Clean your Excel data first:
--    - Remove empty rows
--    - Ensure dates are consistent
--    - Verify vehicle numbers are correct
--    - Check for duplicate policy numbers
--
-- 2. Use Excel formulas to generate SQL:
--    Example formula for row 2:
--    ="INSERT INTO insurance_policies VALUES ('"&A2&"','"&TEXT(B2,"YYYY-MM-DD")&"','"&TEXT(C2,"YYYY-MM-DD")&"','"&D2&"','"&E2&"','"&F2&"','"&G2&"','"&H2&"',"&I2&","&J2&","&K2&",'"&L2&"','"&M2&"',NULL,NULL,'"&N2&"','"&O2&"','"&P2&"',NULL,'active');"
--
-- 3. Test with a small batch first:
--    - Import 5-10 records
--    - Verify data integrity
--    - Check for errors
--    - Then proceed with full import
--
-- 4. Backup before import:
--    pg_dump -U postgres -d tekmegha -t insurance_policies > backup.sql
--
-- 5. Verify after import:
--    SELECT COUNT(*) FROM insurance_policies;
--    SELECT * FROM insurance_policies ORDER BY created_at DESC LIMIT 10;

-- ============================================
-- COMMON ISSUES AND SOLUTIONS
-- ============================================

-- Issue 1: Date format error
-- Solution: Ensure dates are in 'YYYY-MM-DD' format, wrapped in quotes

-- Issue 2: Duplicate policy number
-- Solution: Check for existing policy_no before inserting
-- SELECT policy_no FROM insurance_policies WHERE policy_no = 'YOUR_POLICY_NO';

-- Issue 3: NULL values for required fields
-- Solution: Ensure these fields are never NULL:
--   - policy_no, policy_issue_date, expiry_date, customer_name
--   - vehicle_no, policy_type, net_premium, gross_premium, insurance_company

-- Issue 4: Special characters in names
-- Solution: Use proper escaping:
--   Single quote (') → Two single quotes ('')
--   Example: O'Brien → O''Brien

-- Issue 5: Decimal precision
-- Solution: Use .00 for whole numbers
--   Example: 1000 → 1000.00

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check total imported records
SELECT COUNT(*) as total_policies FROM insurance_policies;

-- Check by status
SELECT status, COUNT(*) FROM insurance_policies GROUP BY status;

-- Check by company
SELECT insurance_company, COUNT(*) as policies, SUM(gross_premium) as revenue
FROM insurance_policies 
GROUP BY insurance_company 
ORDER BY revenue DESC;

-- Check for missing data
SELECT policy_no, customer_name 
FROM insurance_policies 
WHERE email IS NULL OR mb_no IS NULL;

-- Check date ranges
SELECT 
    MIN(policy_issue_date) as earliest_policy,
    MAX(policy_issue_date) as latest_policy,
    COUNT(*) as total
FROM insurance_policies;

-- ============================================
-- END OF TEMPLATE
-- ============================================


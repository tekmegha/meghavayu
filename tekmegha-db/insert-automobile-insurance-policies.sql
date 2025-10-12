-- ============================================
-- Sample Automobile Insurance Policy Data
-- Based on actual policy data
-- ============================================

-- Insert sample policies from the provided data
-- Note: Dates are in DD/MM/YYYY format, converted to YYYY-MM-DD for PostgreSQL

-- Policy 1: CB SHINE - Two Wheeler Stand Alone OD
INSERT INTO insurance_policies (
    policy_no,
    policy_issue_date,
    expiry_date,
    issued_by,
    customer_name,
    vehicle_type,
    policy_type,
    vehicle_no,
    od_premium,
    net_premium,
    gross_premium,
    reference_1,
    reference_2,
    mb_no,
    email,
    payment_mode,
    insurance_company,
    cc_gvw_seating,
    remarks,
    status
) VALUES (
    'VA136853',
    '2022-05-01',
    '2023-05-02',
    'SHIVARAM',
    'KARIVEDA SAGAR REDDY',
    'CB SHINE',
    'TW SOD',
    'TS08GJ6784',
    196.00,
    196.00,
    231.00,
    'CRR',
    'SATHISH ANNA',
    NULL,
    NULL,
    'ONLINE PAYMENT',
    'FUTURE',
    '125',
    NULL,
    'expired'
);

-- Policy 2: EICHER 11 10 - Goods Carrier Vehicle Full
INSERT INTO insurance_policies (
    policy_no,
    policy_issue_date,
    expiry_date,
    issued_by,
    customer_name,
    vehicle_type,
    policy_type,
    vehicle_no,
    od_premium,
    net_premium,
    gross_premium,
    reference_1,
    reference_2,
    mb_no,
    email,
    payment_mode,
    insurance_company,
    cc_gvw_seating,
    remarks,
    status
) VALUES (
    'D057450305',
    '2022-05-01',
    '2023-05-03',
    'VANITH ANNA',
    'SIDDI VINAYAKA INDUSTRIAL GASES PVT LTD',
    'EICHER 11 10',
    'GCV FULL',
    'AP23Y3567',
    693.00,
    18047.00,
    20263.00,
    'MRR',
    'SATHISH ANNA',
    NULL,
    NULL,
    'CUSTOMER ONLINE',
    'DIGIT',
    '11950KG',
    NULL,
    'expired'
);

-- Policy 3: EICHER 10 90 - Goods Carrier Vehicle Full
INSERT INTO insurance_policies (
    policy_no,
    policy_issue_date,
    expiry_date,
    issued_by,
    customer_name,
    vehicle_type,
    policy_type,
    vehicle_no,
    od_premium,
    net_premium,
    gross_premium,
    reference_1,
    reference_2,
    mb_no,
    email,
    payment_mode,
    insurance_company,
    cc_gvw_seating,
    remarks,
    status
) VALUES (
    'D057450280',
    '2022-05-01',
    '2023-05-03',
    'VANITH ANNA',
    'SIDDI VINAYAKA INDUSTRIAL GASES PVT LTD',
    'EICHER 10 90',
    'GCV FULL',
    'AP23Y4477',
    525.00,
    17879.00,
    20065.00,
    'MRR',
    'SATHISH ANNA',
    NULL,
    NULL,
    'CUSTOMER ONLINE',
    'DIGIT',
    '8720KG',
    NULL,
    'expired'
);

-- Policy 4: PLEASURE - Two Wheeler Third Party
INSERT INTO insurance_policies (
    policy_no,
    policy_issue_date,
    expiry_date,
    issued_by,
    customer_name,
    vehicle_type,
    policy_type,
    vehicle_no,
    od_premium,
    net_premium,
    gross_premium,
    reference_1,
    reference_2,
    mb_no,
    email,
    payment_mode,
    insurance_company,
    cc_gvw_seating,
    remarks,
    status
) VALUES (
    'D063502633',
    '2022-05-01',
    '2023-05-01',
    'NA',
    'MALLAIAH THAVATAM',
    'PLEASURE',
    'TW TP',
    'AP29AL2272',
    802.00,
    802.00,
    946.00,
    'NA',
    'SATHISH ANNA',
    NULL,
    NULL,
    'NA',
    'DIGIT',
    '102',
    NULL,
    'expired'
);

-- Additional sample policies for demonstration (current/active policies)
INSERT INTO insurance_policies (
    policy_no,
    policy_issue_date,
    expiry_date,
    issued_by,
    customer_name,
    vehicle_type,
    policy_type,
    vehicle_no,
    od_premium,
    net_premium,
    gross_premium,
    reference_1,
    reference_2,
    payment_mode,
    insurance_company,
    cc_gvw_seating,
    status
) VALUES 
(
    'HD2024001',
    '2024-10-01',
    '2025-10-01',
    'SHIVARAM',
    'RAJESH KUMAR',
    'HONDA ACTIVA',
    'TW FULL',
    'TS09AB1234',
    1200.00,
    2500.00,
    2950.00,
    'CRR',
    'SATHISH ANNA',
    'ONLINE PAYMENT',
    'HDFC',
    '125',
    'active'
),
(
    'IC2024002',
    '2024-09-15',
    '2025-09-15',
    'VANITH ANNA',
    'TECH TRANSPORT SERVICES',
    'TATA ACE',
    'GCV FULL',
    'TS10CD5678',
    2500.00,
    15000.00,
    17700.00,
    'MRR',
    'SATHISH ANNA',
    'CHEQUE',
    'ICICI',
    '1500KG',
    'active'
),
(
    'BJ2024003',
    '2024-08-20',
    '2025-08-20',
    'SHIVARAM',
    'SURESH REDDY',
    'MARUTI SWIFT',
    'CAR FULL',
    'TS07EF9012',
    3500.00,
    8500.00,
    10030.00,
    'DRR',
    'SATHISH ANNA',
    'UPI',
    'BAJAJ',
    '5 SEATER',
    'active'
);

-- Insert payment records for the policies
INSERT INTO policy_payments (policy_no, payment_date, amount, payment_mode, payment_status, transaction_reference)
VALUES 
('VA136853', '2022-05-01', 231.00, 'ONLINE PAYMENT', 'completed', 'TXN001'),
('D057450305', '2022-05-01', 20263.00, 'CUSTOMER ONLINE', 'completed', 'TXN002'),
('D057450280', '2022-05-01', 20065.00, 'CUSTOMER ONLINE', 'completed', 'TXN003'),
('D063502633', '2022-05-01', 946.00, 'NA', 'completed', NULL),
('HD2024001', '2024-10-01', 2950.00, 'ONLINE PAYMENT', 'completed', 'TXN004'),
('IC2024002', '2024-09-15', 17700.00, 'CHEQUE', 'completed', 'CHQ123456'),
('BJ2024003', '2024-08-20', 10030.00, 'UPI', 'completed', 'UPI789012');

-- Create reminders for active policies that will expire soon
INSERT INTO policy_reminders (policy_no, reminder_date, reminder_type, sent)
SELECT 
    policy_no,
    expiry_date - INTERVAL '30 days' as reminder_date,
    'expiry',
    false
FROM insurance_policies
WHERE status = 'active' AND expiry_date > CURRENT_DATE;

-- Sample query to view all policies
-- SELECT * FROM insurance_policies ORDER BY policy_issue_date DESC;

-- Sample query to view policies expiring soon
-- SELECT * FROM policies_expiring_soon;

-- Sample query to view policy statistics by company
-- SELECT * FROM policy_statistics;

-- Sample query to get total revenue by insurance company
-- SELECT 
--     insurance_company,
--     COUNT(*) as total_policies,
--     SUM(gross_premium) as total_premium_collected,
--     AVG(gross_premium) as avg_premium_per_policy
-- FROM insurance_policies
-- WHERE status = 'active'
-- GROUP BY insurance_company
-- ORDER BY total_premium_collected DESC;


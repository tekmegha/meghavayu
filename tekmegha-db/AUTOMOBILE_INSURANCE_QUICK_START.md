# Automobile Insurance - Quick Start Guide

## Setup in 3 Steps

### 1️⃣ Create Database Tables

```bash
psql -U postgres -d tekmegha -f tekmegha-db/automobile-insurance-schema.sql
```

This creates all necessary tables and views.

### 2️⃣ Load Sample Data

```bash
psql -U postgres -d tekmegha -f tekmegha-db/insert-automobile-insurance-policies.sql
```

This inserts 7 sample policies and related data.

### 3️⃣ Access the Application

Navigate to: `http://localhost:4200/automobile-insurance/home`

Or use the shortcut: `http://localhost:4200/insurance`

## Quick Reference

### Policy Types

| Code | Description | Vehicle Category |
|------|-------------|-----------------|
| TW SOD | Stand Alone Own Damage | Two Wheeler |
| TW TP | Third Party Liability | Two Wheeler |
| TW FULL | Comprehensive | Two Wheeler |
| GCV FULL | Goods Carrier - Comprehensive | Commercial |
| PCV FULL | Passenger Carrier - Comprehensive | Commercial |
| CAR FULL | Car - Comprehensive | Four Wheeler |

### Sample Data Included

1. **VA136853** - CB SHINE (TW SOD) - ₹231 - Future Generali
2. **D057450305** - EICHER 11 10 (GCV) - ₹20,263 - Digit
3. **D057450280** - EICHER 10 90 (GCV) - ₹20,065 - Digit
4. **D063502633** - PLEASURE (TW TP) - ₹946 - Digit
5. **HD2024001** - HONDA ACTIVA (TW FULL) - ₹2,950 - HDFC (Active)
6. **IC2024002** - TATA ACE (GCV) - ₹17,700 - ICICI (Active)
7. **BJ2024003** - MARUTI SWIFT (CAR) - ₹10,030 - Bajaj (Active)

### Useful Queries

**View All Active Policies:**
```sql
SELECT * FROM insurance_policies WHERE status = 'active';
```

**View Policies Expiring Soon:**
```sql
SELECT * FROM policies_expiring_soon;
```

**Total Revenue by Company:**
```sql
SELECT 
    insurance_company,
    COUNT(*) as policies,
    SUM(gross_premium) as revenue
FROM insurance_policies
GROUP BY insurance_company
ORDER BY revenue DESC;
```

## Data Structure

### Policy Entry Example

```sql
INSERT INTO insurance_policies (
    policy_no, policy_issue_date, expiry_date,
    issued_by, customer_name, vehicle_type, policy_type,
    vehicle_no, od_premium, net_premium, gross_premium,
    reference_1, reference_2, payment_mode,
    insurance_company, cc_gvw_seating, status
) VALUES (
    'POLICY123',           -- Unique policy number
    '2024-10-01',         -- Issue date
    '2025-10-01',         -- Expiry date
    'SHIVARAM',           -- Agent name
    'CUSTOMER NAME',      -- Customer
    'HONDA ACTIVA',       -- Vehicle type
    'TW FULL',            -- Policy type
    'TS01AB1234',        -- Vehicle number
    1200.00,             -- OD premium
    2500.00,             -- Net premium
    2950.00,             -- Gross premium (with tax)
    'CRR',               -- Reference 1
    'SATHISH ANNA',      -- Reference 2
    'ONLINE PAYMENT',    -- Payment mode
    'HDFC',              -- Insurance company
    '125',               -- CC/GVW/Seating
    'active'             -- Status
);
```

## Navigation Structure

### Bottom Navigation Bar

- 🏠 **Home** - Dashboard overview
- 📄 **Policies** - View all policies  
- ➕ **New Policy** - Create new policy
- 📊 **Reports** - Analytics and reports
- 👤 **Profile** - User profile

## Tables Created

1. `insurance_policies` - Main policy data
2. `insurance_companies` - Insurance company master
3. `insurance_agents` - Agent information
4. `policy_types` - Policy type definitions
5. `policy_renewals` - Renewal tracking
6. `policy_payments` - Payment records
7. `policy_reminders` - Expiry reminders
8. `policy_audit_log` - Change history

## Views Created

1. `policies_expiring_soon` - Policies expiring in next 30 days
2. `policy_statistics` - Aggregated statistics by company and type

## Features

✅ Policy management (CRUD)
✅ Multi-vehicle type support
✅ Payment tracking
✅ Automatic expiry reminders
✅ Audit trail
✅ Reports and analytics
✅ Multi-agent support
✅ Multiple insurance companies

## Brand Configuration

- **Primary Color**: Cyan `#0891b2`
- **Theme**: Insurance
- **Route**: `/automobile-insurance`
- **Short Route**: `/insurance`

## Next Steps

1. ✅ Database setup complete
2. ✅ Sample data loaded
3. ⏭️ Access the UI and test
4. ⏭️ Create your first policy
5. ⏭️ Set up automated reminders
6. ⏭️ Configure backup strategy

---

For detailed documentation, see: `AUTOMOBILE_INSURANCE_SETUP.md`


# Automobile Insurance Policy Management Setup Guide

This guide provides complete instructions for setting up the Automobile Insurance Policy Management system within the TekMegha platform.

## Overview

The Automobile Insurance layout is designed to manage vehicle insurance policies with features including:
- Policy creation and management
- Multiple vehicle types (Two Wheeler, Four Wheeler, Commercial)
- Payment tracking
- Policy renewal reminders
- Reporting and analytics
- Multi-agent support

## Features

### Policy Management
- Track all insurance policies in one place
- Support for multiple policy types:
  - Two Wheeler (TW SOD, TW TP, TW FULL)
  - Goods Carrier Vehicle (GCV FULL)
  - Passenger Carrier Vehicle (PCV FULL)
  - Private Car (CAR FULL, CAR TP)

### Vehicle Types Supported
- Two Wheelers (Bikes, Scooters)
- Four Wheelers (Private Cars)
- Commercial Vehicles (GCV, PCV)

### Insurance Companies
- Digit Insurance
- Future Generali
- HDFC ERGO
- ICICI Lombard
- Bajaj Allianz
- SBI General Insurance
- TATA AIG
- Reliance General

### Payment Tracking
- Multiple payment modes supported
- Payment history
- Transaction reference tracking

## Database Setup

### Step 1: Create Database Schema

Run the schema creation script to set up all required tables:

```bash
psql -U your_username -d your_database -f tekmegha-db/automobile-insurance-schema.sql
```

This creates the following tables:
- `insurance_policies` - Main policy information
- `insurance_companies` - Insurance company master data
- `insurance_agents` - Agent/broker information
- `policy_types` - Different policy type definitions
- `policy_renewals` - Renewal tracking
- `policy_payments` - Payment records
- `policy_reminders` - Expiry reminders
- `policy_audit_log` - Audit trail

### Step 2: Insert Sample Data

Load sample policy data:

```bash
psql -U your_username -d your_database -f tekmegha-db/insert-automobile-insurance-policies.sql
```

This inserts:
- 7 sample policies (both active and expired)
- Payment records
- Automatic expiry reminders

## Application Configuration

### Brand Configuration

The automobile insurance brand is already configured in `brand.service.ts` with:

- **Theme Color**: Cyan/Teal gradient
- **Primary Color**: `#0891b2`
- **Secondary Color**: `#06b6d4`
- **Accent Color**: `#14b8a6`

### Navigation

#### Top Navbar
- Menu icon (left)
- "Automobile Insurance" title (center)
- Account/Login icon (right)

#### Bottom Navbar
- **Home**: Dashboard overview
- **Policies**: View all policies
- **New Policy**: Create new policy
- **Reports**: Analytics and reporting
- **Profile**: User profile

## Accessing the Layout

### Via URL
Navigate to:
```
http://localhost:4200/automobile-insurance/home
```

Or use the short redirect:
```
http://localhost:4200/insurance
```

### Via Store Selector
The automobile insurance option will appear in the store selector if properly configured.

## Data Model

### Insurance Policy Fields

| Field | Type | Description |
|-------|------|-------------|
| policy_no | VARCHAR(50) | Unique policy number |
| policy_issue_date | DATE | Date when policy was issued |
| expiry_date | DATE | Policy expiry date |
| issued_by | VARCHAR(100) | Agent who issued the policy |
| customer_name | VARCHAR(255) | Customer/policyholder name |
| vehicle_type | VARCHAR(100) | Vehicle make/model |
| policy_type | VARCHAR(50) | Type of policy (TW SOD, GCV FULL, etc.) |
| vehicle_no | VARCHAR(20) | Vehicle registration number |
| cc_gvw_seating | VARCHAR(50) | CC for bikes, GVW for commercial, Seating capacity for cars |
| od_premium | DECIMAL(10,2) | Own Damage premium |
| net_premium | DECIMAL(10,2) | Net premium amount |
| gross_premium | DECIMAL(10,2) | Gross premium (including taxes) |
| reference_1 | VARCHAR(50) | Primary reference code |
| reference_2 | VARCHAR(100) | Secondary reference |
| mb_no | VARCHAR(50) | Mobile number |
| email | VARCHAR(255) | Email address |
| payment_mode | VARCHAR(50) | Payment method |
| insurance_company | VARCHAR(100) | Insurance company code |
| remarks | TEXT | Additional notes |
| status | VARCHAR(20) | Policy status (active/expired/cancelled/renewed) |

## Policy Types Reference

### Two Wheeler
- **TW SOD**: Stand Alone Own Damage
- **TW TP**: Third Party Liability
- **TW FULL**: Comprehensive Coverage

### Commercial Vehicle
- **GCV FULL**: Goods Carrier Vehicle - Comprehensive
- **PCV FULL**: Passenger Carrier Vehicle - Comprehensive

### Private Car
- **CAR FULL**: Comprehensive Coverage
- **CAR TP**: Third Party Liability

## Sample Data

The system includes sample data from:
- KARIVEDA SAGAR REDDY - CB SHINE (TW SOD)
- SIDDI VINAYAKA INDUSTRIAL GASES PVT LTD - EICHER vehicles (GCV FULL)
- MALLAIAH THAVATAM - PLEASURE (TW TP)
- And 3 additional active policies for demonstration

## API Integration (Future)

### Supabase Tables Required

If using Supabase, ensure these tables are created:

1. **insurance_policies** - Core policy data
2. **insurance_companies** - Company master
3. **insurance_agents** - Agent information
4. **policy_payments** - Payment tracking
5. **policy_reminders** - Automated reminders

### Environment Configuration

Update `environment.ts` and `environment.prod.ts` with Supabase credentials if needed:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'your-supabase-url',
  supabaseKey: 'your-supabase-key',
  // ... other config
};
```

## Customization

### Adding New Insurance Companies

```sql
INSERT INTO insurance_companies (company_code, company_name, phone, email)
VALUES ('NEWCO', 'New Insurance Company', '+91 1234567890', 'contact@newco.com');
```

### Adding New Policy Types

```sql
INSERT INTO policy_types (type_code, type_name, vehicle_category, description)
VALUES ('NEW_TYPE', 'New Policy Type', 'Category', 'Description');
```

### Adding New Agents

```sql
INSERT INTO insurance_agents (agent_code, agent_name, phone, email, commission_rate)
VALUES ('NEWAGENT', 'New Agent Name', '+91 9876543210', 'agent@email.com', 5.00);
```

## Views and Reports

### Policies Expiring Soon
```sql
SELECT * FROM policies_expiring_soon;
```
Shows all policies expiring in the next 30 days.

### Policy Statistics
```sql
SELECT * FROM policy_statistics;
```
Aggregated statistics by company and policy type.

### Revenue Report
```sql
SELECT 
    insurance_company,
    COUNT(*) as total_policies,
    SUM(gross_premium) as total_premium,
    AVG(gross_premium) as avg_premium
FROM insurance_policies
WHERE status = 'active'
GROUP BY insurance_company
ORDER BY total_premium DESC;
```

## Features to Implement

### Recommended Enhancements

1. **Automated Reminders**
   - Email/SMS notifications for expiring policies
   - Renewal reminders 30, 15, and 7 days before expiry

2. **Document Management**
   - Upload and store policy documents
   - Vehicle RC copies
   - Previous policy documents

3. **Commission Tracking**
   - Agent commission calculation
   - Commission payout tracking

4. **Customer Portal**
   - Customers can view their policies
   - Online renewal requests
   - Download policy documents

5. **Mobile App**
   - Policy management on the go
   - Quick policy lookup
   - Payment processing

6. **Analytics Dashboard**
   - Revenue trends
   - Policy distribution charts
   - Agent performance metrics

## Troubleshooting

### Issue: Cannot access automobile-insurance route

**Solution**: Ensure routes are properly configured in `app.routes.ts` and the brand is registered in `brand.service.ts`.

### Issue: Database tables not created

**Solution**: Check PostgreSQL connection and run the schema creation script with proper permissions.

### Issue: Sample data not loading

**Solution**: Ensure the schema is created first, then run the data insertion script.

### Issue: Brand colors not applying

**Solution**: Clear browser cache and ensure CSS variables are properly set in `brand.service.ts`.

## Testing

### Test Policy Creation

```sql
INSERT INTO insurance_policies (
    policy_no, policy_issue_date, expiry_date,
    issued_by, customer_name, vehicle_type, policy_type,
    vehicle_no, net_premium, gross_premium,
    insurance_company, status
) VALUES (
    'TEST001', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year',
    'SHIVARAM', 'Test Customer', 'TEST BIKE', 'TW FULL',
    'TS00XX0000', 2000.00, 2360.00,
    'HDFC', 'active'
);
```

### Verify Data

```sql
-- Count total policies
SELECT COUNT(*) FROM insurance_policies;

-- Check policies by status
SELECT status, COUNT(*) FROM insurance_policies GROUP BY status;

-- View latest policies
SELECT * FROM insurance_policies ORDER BY created_at DESC LIMIT 10;
```

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the database schema documentation
- Examine the sample data for reference patterns

## Version History

- **v1.0** (October 2024) - Initial setup with basic policy management
  - Policy CRUD operations
  - Payment tracking
  - Expiry reminders
  - Multi-agent support

## Next Steps

1. Test the setup by accessing `/automobile-insurance/home`
2. Create a test policy through the UI
3. Verify data is being saved correctly
4. Set up automated reminder system
5. Configure backup strategy for policy data

---

**Note**: This system is designed to be extensible. Add custom fields, reports, and features as needed for your specific business requirements.


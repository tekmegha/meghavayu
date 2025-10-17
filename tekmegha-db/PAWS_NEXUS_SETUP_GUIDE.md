# Paws Nexus Pet Care Store Setup Guide

This guide will help you set up the complete Paws Nexus pet care store with all necessary database tables, services, and UI components.

## Overview

Paws Nexus is a pet care service store that offers:
- House visits for pet care
- Vaccinations
- Deworming treatments
- Walk-in consultations
- Blood sampling
- Critical care services
- Freelance veterinarian network
- Partner pet stores

## Database Setup

### 1. Run the Complete Setup Script

```sql
-- Run the complete setup script
\i setup-paws-nexus-complete.sql
```

### 2. Individual Setup Steps

If you prefer to run individual scripts:

```sql
-- Step 1: Create pet care schema
\i pet-care-schema.sql

-- Step 2: Insert store and data
\i insert-paws-nexus-store.sql
```

## Database Tables Created

### Core Tables
- `pet_care_services` - Pet care services offered
- `freelance_doctors` - Veterinarians and pet care professionals
- `pet_stores` - Partner pet stores for supplies
- `doctor_services` - Many-to-many relationship between doctors and services
- `pet_appointments` - Pet care appointments and consultations
- `pet_emergency_contacts` - Emergency contact information

### Services Available
1. **House Visits** - ₹500 (60 min) - Home visit available
2. **Vaccinations** - ₹300 (30 min) - Home visit available
3. **Deworming** - ₹200 (20 min) - Home visit available
4. **Walk In Consultations** - ₹400 (45 min) - No appointment needed
5. **Blood Sampling** - ₹350 (30 min) - Home visit available
6. **Critical Care Services** - ₹1000 (120 min) - Emergency service

## Frontend Components

### 1. Layout Component
- **File**: `tekmegha-fe/src/app/layout-pet-care/`
- **Purpose**: Specialized layout for pet care stores
- **Features**: Medical theme colors, pet care specific styling

### 2. Services Component
- **File**: `tekmegha-fe/src/app/pet-care-services/`
- **Purpose**: Display pet care services and booking
- **Features**: Service cards, doctor profiles, contact information

### 3. Dynamic Layout Integration
- Updated `dynamic-layout.ts` to include pet care layout
- Added `paws-nexus` to special layouts list

## Store Configuration

### Theme Configuration
```json
{
  "primaryColor": "#0891b2",
  "secondaryColor": "#06b6d4",
  "accentColor": "#14b8a6",
  "backgroundColor": "#f0fdfa",
  "surfaceColor": "#ffffff",
  "layout": "layout-pet-care"
}
```

### Features Enabled
- Inventory management
- Delivery services
- Payment processing
- Invoice generation
- Customer management
- Reporting
- Appointment booking
- Home visits
- Emergency services

## Contact Information

- **Phone**: 8550046444
- **Social Media**: @paws_nexus
- **Email**: info@paws-nexus.com
- **Address**: 123 Pet Care Street, Veterinary District, Mumbai - 400001

## Sample Data

### Veterinarians
1. **Dr. Sarah Johnson** - BVSc, MVSc (8 years experience)
   - Consultation: ₹500
   - Home Visit: ₹200
   - Emergency: ₹1000
   - Rating: 4.8/5 (150 reviews)

2. **Dr. Michael Chen** - DVM, PhD (12 years experience)
   - Consultation: ₹600
   - Home Visit: ₹250
   - Emergency: ₹1200
   - Rating: 4.9/5 (200 reviews)

### Partner Stores
1. **Pet Paradise Supplies** - Pet supplies and accessories
2. **VetMed Pharmacy** - Pet medicines and health products

## API Endpoints (Future Implementation)

### Services
- `GET /api/pet-care-services` - Get all services
- `POST /api/pet-care-services` - Create new service
- `PUT /api/pet-care-services/:id` - Update service

### Doctors
- `GET /api/freelance-doctors` - Get all doctors
- `POST /api/freelance-doctors` - Add new doctor
- `GET /api/freelance-doctors/:id/services` - Get doctor's services

### Appointments
- `GET /api/pet-appointments` - Get appointments
- `POST /api/pet-appointments` - Book appointment
- `PUT /api/pet-appointments/:id` - Update appointment

## Testing the Setup

### 1. Verify Store Creation
```sql
SELECT store_code, store_name, store_type, is_active 
FROM megha_stores 
WHERE store_code = 'paws-nexus';
```

### 2. Check Services
```sql
SELECT service_name, price, is_home_visit_available 
FROM pet_care_services 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus');
```

### 3. Verify Doctors
```sql
SELECT full_name, specialization, consultation_fee 
FROM freelance_doctors 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code  = 'paws-nexus');
```

## Frontend Integration

### 1. Add Route
Add the pet care services route to your routing configuration:

```typescript
{
  path: 'paws-nexus/services',
  component: PetCareServicesComponent
}
```

### 2. Update Navigation
Add pet care services to the navigation menu for the paws-nexus store.

### 3. Brand Configuration
The store will automatically use the pet care layout when `store_code = 'paws-nexus'`.

## Emergency Contacts

- **Emergency Vet Line**: 8550046444
- **Pet Ambulance**: 8550046445
- **Poison Control**: 8550046446

All emergency contacts are available 24/7.

## Next Steps

1. **Run the database setup scripts**
2. **Test the store configuration**
3. **Implement the frontend components**
4. **Add API endpoints for data fetching**
5. **Configure payment processing**
6. **Set up appointment booking system**
7. **Implement notification system for appointments**

## Troubleshooting

### Common Issues

1. **Store not appearing**: Check if the store is active and the store_code is correct
2. **Services not loading**: Verify the megha_store_id foreign key relationship
3. **Layout not applying**: Ensure the dynamic layout component includes the pet care layout
4. **Styling issues**: Check if the pet care SCSS variables are properly defined

### Verification Queries

```sql
-- Check if store exists and is active
SELECT * FROM megha_stores WHERE store_code = 'paws-nexus';

-- Check if services are properly linked
SELECT COUNT(*) FROM pet_care_services 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus');

-- Check if doctors are properly linked
SELECT COUNT(*) FROM freelance_doctors 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus');
```

This setup provides a complete pet care service platform with all necessary database tables, UI components, and configuration for the Paws Nexus store.

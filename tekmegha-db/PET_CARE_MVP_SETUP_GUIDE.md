# Pet Care MVP Setup Guide

## 🎯 **Overview**
This guide covers the complete setup of the Pet Care MVP system with staff management, inventory management, and appointment management.

## 📋 **Prerequisites**
- PostgreSQL database with Supabase
- Angular 17+ application
- Existing `megha_stores` table
- Existing pet care schema from `pet-care-schema.sql`

## 🗄️ **Database Setup**

### Step 1: Run the MVP Schema
```sql
-- Execute the pet care MVP schema
\i pet-care-mvp-schema.sql
```

### Step 2: Verify Tables Created
```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'staff_members', 
    'staff_schedules', 
    'pet_inventory', 
    'inventory_transactions',
    'appointment_slots'
  );
```

### Step 3: Verify Sample Data
```sql
-- Check sample data
SELECT 
  'Staff Members' as table_name,
  COUNT(*) as record_count
FROM staff_members
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus');
```

## 🎨 **Frontend Setup**

### Step 1: Import Components
Add the pet care components to your main app module or routing:

```typescript
// In app.routes.ts
import { StaffManagementComponent } from './pet-care/staff-management/staff-management';
import { InventoryManagementComponent } from './pet-care/inventory-management/inventory-management';
import { AppointmentManagementComponent } from './pet-care/appointment-management/appointment-management';
```

### Step 2: Add Routes
```typescript
// Add to your routes configuration
{ path: 'paws-nexus/staff', component: StaffManagementComponent },
{ path: 'paws-nexus/inventory', component: InventoryManagementComponent },
{ path: 'paws-nexus/appointments', component: AppointmentManagementComponent },
```

### Step 3: Update Supabase Service
Ensure your `SupabaseService` has the required methods for pet care operations.

## 🚀 **Features Implemented**

### **1. Staff Management**
- ✅ Add, edit, delete staff members
- ✅ Staff scheduling system
- ✅ Role-based management (doctor, groomer, trainer, etc.)
- ✅ Staff status tracking
- ✅ Qualifications and specialization tracking

### **2. Inventory Management**
- ✅ Inventory item CRUD operations
- ✅ Stock level monitoring
- ✅ Transaction history tracking
- ✅ Low stock alerts
- ✅ Expiry date tracking
- ✅ Supplier management

### **3. Appointment Management**
- ✅ Appointment booking and scheduling
- ✅ Pet information management
- ✅ Doctor and service assignment
- ✅ Status tracking (scheduled, confirmed, completed, etc.)
- ✅ Payment status management
- ✅ Appointment history

## 📊 **Database Schema**

### **Staff Management Tables**
```sql
staff_members
├── id (UUID, Primary Key)
├── megha_store_id (UUID, Foreign Key)
├── staff_code (VARCHAR, Unique)
├── full_name (VARCHAR)
├── role (VARCHAR) -- doctor, groomer, trainer, etc.
├── specialization (VARCHAR)
├── qualifications (TEXT)
├── phone (VARCHAR)
├── email (VARCHAR)
├── address (TEXT)
├── hire_date (DATE)
├── salary (DECIMAL)
├── is_active (BOOLEAN)
└── created_at, updated_at (TIMESTAMP)

staff_schedules
├── id (UUID, Primary Key)
├── staff_id (UUID, Foreign Key)
├── day_of_week (INTEGER) -- 0=Sunday, 1=Monday, etc.
├── start_time (TIME)
├── end_time (TIME)
├── is_available (BOOLEAN)
└── created_at (TIMESTAMP)
```

### **Inventory Management Tables**
```sql
pet_inventory
├── id (UUID, Primary Key)
├── megha_store_id (UUID, Foreign Key)
├── item_code (VARCHAR, Unique)
├── item_name (VARCHAR)
├── category (VARCHAR) -- medicine, supplies, equipment, etc.
├── subcategory (VARCHAR)
├── description (TEXT)
├── unit_price (DECIMAL)
├── quantity_in_stock (INTEGER)
├── minimum_stock_level (INTEGER)
├── supplier (VARCHAR)
├── expiry_date (DATE)
├── is_active (BOOLEAN)
└── created_at, updated_at (TIMESTAMP)

inventory_transactions
├── id (UUID, Primary Key)
├── inventory_id (UUID, Foreign Key)
├── transaction_type (VARCHAR) -- purchase, sale, adjustment, etc.
├── quantity (INTEGER)
├── unit_price (DECIMAL)
├── total_amount (DECIMAL)
├── notes (TEXT)
└── created_at (TIMESTAMP)
```

## 🔧 **API Endpoints**

### **Staff Management**
- `GET /staff-members` - Get all staff members
- `POST /staff-members` - Create new staff member
- `PUT /staff-members/:id` - Update staff member
- `DELETE /staff-members/:id` - Delete staff member
- `GET /staff-schedules` - Get staff schedules
- `POST /staff-schedules` - Create staff schedule

### **Inventory Management**
- `GET /pet-inventory` - Get inventory items
- `POST /pet-inventory` - Create inventory item
- `PUT /pet-inventory/:id` - Update inventory item
- `DELETE /pet-inventory/:id` - Delete inventory item
- `GET /inventory-transactions` - Get transactions
- `POST /inventory-transactions` - Create transaction

### **Appointment Management**
- `GET /pet-appointments` - Get appointments
- `POST /pet-appointments` - Create appointment
- `PUT /pet-appointments/:id` - Update appointment
- `DELETE /pet-appointments/:id` - Delete appointment
- `GET /appointment-slots` - Get available slots

## 📱 **Mobile-First Design**

All components are designed with mobile-first approach:
- Responsive grid layouts
- Touch-friendly buttons
- Optimized form inputs
- Mobile navigation
- Swipe gestures support

## 🎨 **UI Components**

### **Staff Management**
- Staff card grid layout
- Role-based filtering
- Schedule management interface
- Status indicators
- Action buttons

### **Inventory Management**
- Inventory item cards
- Stock level indicators
- Transaction history
- Low stock alerts
- Category filtering

### **Appointment Management**
- Appointment calendar view
- Pet information forms
- Status tracking
- Payment management
- Doctor assignment

## 🔍 **Testing**

### **Database Testing**
```sql
-- Test staff member creation
INSERT INTO staff_members (megha_store_id, staff_code, full_name, role, phone, hire_date)
VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'TEST001',
  'Test Staff',
  'doctor',
  '1234567890',
  '2024-01-01'
);

-- Test inventory item creation
INSERT INTO pet_inventory (megha_store_id, item_code, item_name, category, unit_price, quantity_in_stock)
VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'TEST001',
  'Test Item',
  'medicine',
  100.00,
  10
);
```

### **Frontend Testing**
1. Navigate to `/paws-nexus/staff`
2. Test adding new staff member
3. Test editing existing staff
4. Test staff scheduling
5. Navigate to `/paws-nexus/inventory`
6. Test inventory management
7. Test transaction recording

## 🚀 **Deployment**

### **Database Migration**
1. Run `pet-care-mvp-schema.sql` on production database
2. Verify all tables and indexes are created
3. Test sample data insertion

### **Frontend Deployment**
1. Build the Angular application
2. Deploy to your hosting platform
3. Update routing configuration
4. Test all pet care features

## 📈 **Analytics & Reporting**

### **Staff Analytics**
- Staff performance metrics
- Schedule utilization
- Role distribution

### **Inventory Analytics**
- Stock level reports
- Transaction summaries
- Low stock alerts
- Expiry tracking

### **Appointment Analytics**
- Appointment volume
- Completion rates
- Revenue tracking
- Pet type distribution

## 🔒 **Security Considerations**

- Row-level security for multi-tenant data
- Input validation on all forms
- SQL injection prevention
- XSS protection
- CSRF protection

## 📞 **Support**

For issues or questions:
1. Check the database schema
2. Verify Supabase connection
3. Review component imports
4. Check console for errors
5. Test with sample data

## 🎯 **Next Steps**

1. **Complete MVP Testing** - Test all features thoroughly
2. **User Training** - Train staff on new system
3. **Data Migration** - Migrate existing data if needed
4. **Performance Optimization** - Optimize queries and UI
5. **Analytics Implementation** - Add reporting features
6. **Mobile App** - Consider mobile app development

---

**Status**: ✅ MVP Core Modules Complete
**Next Phase**: Beta Launch with 25 Partners in Bangalore

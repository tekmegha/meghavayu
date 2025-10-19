# MVP Implementation Plan - Paws Nexus

## 🎯 **Current Status: MVP Core Modules**

### ✅ **Completed Components**
- [x] Pet care database schema
- [x] Paws Nexus store configuration
- [x] Pet care services component
- [x] Dynamic layout system
- [x] Routing configuration

### 🔄 **In Progress: Staff Management**

#### Database Schema Updates Needed
```sql
-- Add staff management tables
CREATE TABLE staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id),
  staff_code VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'doctor', 'groomer', 'trainer', 'receptionist'
  specialization VARCHAR(255),
  qualifications TEXT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  hire_date DATE,
  salary DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE staff_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES staff_members(id),
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Frontend Components Needed
- `StaffManagementComponent` - Staff CRUD operations
- `StaffScheduleComponent` - Schedule management
- `StaffProfileComponent` - Individual staff profiles

### 🔄 **In Progress: Inventory Management**

#### Database Schema Updates Needed
```sql
-- Add inventory management tables
CREATE TABLE pet_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id),
  item_code VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'medicine', 'supplies', 'equipment', 'food'
  subcategory VARCHAR(100),
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 0,
  supplier VARCHAR(255),
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID REFERENCES pet_inventory(id),
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'expiry'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Frontend Components Needed
- `InventoryManagementComponent` - Inventory CRUD
- `StockLevelsComponent` - Stock monitoring
- `InventoryReportsComponent` - Inventory analytics

### 🔄 **In Progress: Appointment Management**

#### Database Schema Updates Needed
```sql
-- Enhance existing pet_appointments table
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS appointment_duration INTEGER DEFAULT 30;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS follow_up_date DATE;

-- Add appointment slots table
CREATE TABLE appointment_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id),
  doctor_id UUID REFERENCES freelance_doctors(id),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT true,
  is_booked BOOLEAN DEFAULT false,
  appointment_id UUID REFERENCES pet_appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Frontend Components Needed
- `AppointmentBookingComponent` - Customer booking interface
- `AppointmentCalendarComponent` - Calendar view
- `AppointmentManagementComponent` - Admin management
- `AppointmentRemindersComponent` - Reminder system

### 🔄 **In Progress: Invoicing System**

#### Database Schema Updates Needed
```sql
-- Add pet care specific invoice templates
CREATE TABLE pet_invoice_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id),
  template_name VARCHAR(255) NOT NULL,
  template_type VARCHAR(100) NOT NULL, -- 'consultation', 'treatment', 'emergency', 'grooming'
  services JSONB, -- Array of services included
  pricing_structure JSONB, -- Pricing rules
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add pet care specific invoice items
CREATE TABLE pet_invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  service_type VARCHAR(100) NOT NULL, -- 'consultation', 'treatment', 'medicine', 'procedure'
  service_name VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  pet_name VARCHAR(255),
  pet_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Frontend Components Needed
- `PetInvoiceComponent` - Pet care specific invoicing
- `InvoiceTemplatesComponent` - Template management
- `PetInvoiceItemsComponent` - Service item management

---

## 🚀 **Implementation Priority**

### **Week 1-2: Staff Management**
1. Create staff management database schema
2. Build staff CRUD components
3. Implement staff scheduling
4. Add staff profiles to pet care services

### **Week 3-4: Inventory Management**
1. Create inventory database schema
2. Build inventory management components
3. Implement stock level monitoring
4. Add inventory to pet care services

### **Week 5-6: Appointment Management**
1. Enhance appointment database schema
2. Build appointment booking interface
3. Implement calendar system
4. Add reminder functionality

### **Week 7-8: Invoicing System**
1. Create pet care invoice templates
2. Build pet-specific invoicing
3. Implement service item management
4. Add invoice generation

---

## 📊 **Success Metrics for MVP**

### **Technical Metrics**
- [ ] 4 core modules implemented
- [ ] 100% mobile responsive
- [ ] < 3 second page load times
- [ ] 99% uptime

### **Business Metrics**
- [ ] 5 pilot stores onboarded
- [ ] 50+ services configured
- [ ] 20+ staff members registered
- [ ] 100+ appointments booked

### **User Experience Metrics**
- [ ] < 5 clicks to book appointment
- [ ] < 3 clicks to create invoice
- [ ] 90%+ user satisfaction
- [ ] Mobile-first design

---

## 🛠️ **Technical Requirements**

### **Database**
- PostgreSQL with Supabase
- Real-time subscriptions
- Row-level security
- Automated backups

### **Frontend**
- Angular 17+ with standalone components
- Mobile-first responsive design
- Progressive Web App (PWA)
- Offline capability

### **Backend**
- Supabase backend
- Real-time updates
- File storage for images
- Email/SMS notifications

### **Integration**
- Payment processing
- SMS gateway
- Email service
- Analytics tracking

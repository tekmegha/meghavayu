# CCTV Device Setup Guide

This guide will help you set up the CCTV Device digital security app in your TekMegha system.

## 🔒 **About CCTV Device**

CCTV Device is a comprehensive digital security platform offering:
- **CCTV Cameras**: IP, Analog, Wireless, PTZ, Dome, Bullet cameras
- **Security Systems**: Home, Commercial, Industrial, Retail security solutions
- **Access Control**: Biometric, RFID, Keypad, Intercom systems
- **Alarm Systems**: Intrusion detection, Fire safety, Emergency systems
- **Network Security**: NVR, PoE switches, Network infrastructure
- **Smart Security**: AI analytics, IoT sensors, Mobile apps, Cloud storage
- **Services**: Installation, Maintenance, Monitoring, Support

## 🚀 **Setup Steps**

### **Step 1: Create Store Record**

Run the SQL script to create the CCTV Device store:

```sql
-- Run this in your Supabase SQL editor
\i insert-cctv-device-store.sql
```

This will create:
- Store record with digital security theme
- Dark theme configuration with security-focused colors
- Business hours and contact information
- Layout configuration for `layout-digitalsecurity`

### **Step 2: Add Categories**

Run the categories script to create the category structure:

```sql
-- Run this in your Supabase SQL editor
\i insert-cctv-device-categories.sql
```

This creates:
- **Main Categories**: CCTV Cameras, Security Systems, Access Control, Alarm Systems, Network Security, Fire Safety, Smart Security, Monitoring, Installation, Maintenance
- **Camera Subcategories**: IP Cameras, Analog Cameras, Wireless Cameras, PTZ Cameras, Dome Cameras, Bullet Cameras, Night Vision, 4K Cameras
- **Security Subcategories**: Home, Commercial, Industrial, Retail, Hospital, School, Bank, Government security
- **Access Control Subcategories**: Biometric, Card Readers, Keypad, Intercom, Door Controllers, Turnstiles, Vehicle Barriers, Visitor Management
- **Smart Security Subcategories**: AI Analytics, IoT Sensors, Mobile Apps, Cloud Storage, Remote Monitoring, Smart Alerts, Integration, Automation

### **Step 3: Add Sample Products**

Run the products script to create sample security products:

```sql
-- Run this in your Supabase SQL editor
\i insert-cctv-device-products.sql
```

This creates sample products including:
- **CCTV Cameras**: 4K Ultra HD IP Camera (₹15,999), Wireless WiFi Camera (₹8,999), PTZ Security Camera (₹24,999)
- **Security Systems**: Complete Home Security System (₹49,999), Commercial Security Package (₹99,999)
- **Access Control**: Biometric Fingerprint Scanner (₹12,999), RFID Card Reader System (₹7,999)
- **Alarm Systems**: Wireless Intrusion Alarm (₹14,999), Fire Detection System (₹19,999)
- **Network Security**: Network Video Recorder (₹29,999), PoE Network Switch (₹8,999)
- **Smart Security**: AI Video Analytics System (₹39,999), Smart Home Security Hub (₹24,999)
- **Services**: Professional Installation Service (₹9,999), Annual Maintenance Contract (₹19,999)

### **Step 4: Verify Setup**

Check that everything is working:

```sql
-- Verify store
SELECT store_name, store_code, store_type, is_active 
FROM megha_stores 
WHERE store_code = 'cctv-device';

-- Verify categories
SELECT name, slug, parent_id 
FROM categories 
WHERE megha_store_id = (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device'
) 
ORDER BY sort_order;

-- Verify products
SELECT sku, name, price, category, is_featured 
FROM products 
WHERE megha_store_id = (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device'
) 
ORDER BY sort_order;
```

## 🎨 **Theme Configuration**

CCTV Device uses a dark, professional security theme:
- **Primary Color**: Deep Blue (#1a237e) - Professional and trustworthy
- **Secondary Color**: Medium Blue (#3949ab) - Modern and tech-focused
- **Accent Color**: Bright Green (#00e676) - Security/success indicators
- **Warning Color**: Orange (#ff9800) - Alert indicators
- **Danger Color**: Red (#f44336) - Threat indicators
- **Background**: Dark (#0d1117) - Professional security environment
- **Surface**: Dark Gray (#161b22) - Card backgrounds
- **Text**: Light (#f0f6fc) - High contrast for readability

## 📱 **App Features**

### **Product Structure**
- **Image**: Product photos and technical diagrams
- **Title**: Product names with specifications
- **Description**: Detailed technical specifications and features
- **Tags**: Searchable tags like "4k", "wireless", "ai-analytics", "biometric"
- **Price**: Product pricing with customization options
- **Rating**: Customer ratings and reviews
- **Category**: Product type and application area

### **Categories**
- **Product-based**: CCTV Cameras, Security Systems, Access Control, Alarm Systems
- **Application-based**: Home, Commercial, Industrial, Retail security
- **Technology-based**: IP, Wireless, AI, IoT, Cloud solutions
- **Service-based**: Installation, Maintenance, Monitoring, Support

### **Product Types**
1. **Hardware**: Cameras, recorders, sensors, controllers
2. **Software**: Management systems, mobile apps, analytics
3. **Services**: Installation, maintenance, monitoring, support
4. **Systems**: Complete security solutions and packages
5. **Accessories**: Cables, mounts, storage, networking equipment

## 🔧 **Customization**

### **Adding New Categories**
```sql
INSERT INTO categories (megha_store_id, name, description, slug, parent_id, sort_order, is_active)
VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'cctv-device'),
  'New Security Category',
  'Category description',
  'new-security-category',
  NULL, -- or parent category ID
  20,
  true
);
```

### **Adding New Products**
```sql
INSERT INTO products (megha_store_id, sku, name, price, description, category, tags, is_available)
VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'cctv-device'),
  'NEW-001',
  'New Security Product',
  19999.00,
  'Product description',
  'CCTV Cameras',
  '["new-product", "security", "cctv"]'::jsonb,
  true
);
```

## 🎯 **Usage**

1. **Select CCTV Device** from the app selector
2. **Browse Categories** by product type or application
3. **View Products** with detailed technical specifications
4. **Filter by Tags** to find specific security solutions
5. **Customize Products** with available options
6. **Add to Cart** and proceed to checkout

## 📊 **Analytics**

Track performance with:
- **Product Popularity**: Most viewed/purchased security products
- **Category Performance**: Which security solutions are most popular
- **Application Trends**: Which industries need security solutions
- **User Engagement**: Time spent on different product types

## 🚨 **Troubleshooting**

### **Categories Not Loading**
- Check if store ID is correct
- Verify RLS policies
- Ensure categories are active

### **Products Not Displaying**
- Check if products are active
- Verify store ID mapping
- Check image URLs

### **Theme Not Applying**
- Verify theme configuration in store record
- Check CSS class names
- Ensure layout-digitalsecurity component exists

## 📞 **Support**

For issues with CCTV Device setup:
- Check the console for errors
- Verify database connections
- Test with sample data first
- Contact support if needed

---

**CCTV Device** is now ready to provide comprehensive digital security solutions! 🔒📹

# Invoice Layout Template System

## Overview
The invoice template system now focuses on **visual layout structure** with configurable sections: **Topbar**, **Header**, **Body**, and **Footer**. Each section can be customized independently to create professional, branded invoices.

## Template Layout Structure

### 🎨 **Visual Layout Components**

```
┌─────────────────────────────────────────────────────────┐
│                    TOPBAR SECTION                        │
│              (Optional welcome message)                 │
├─────────────────────────────────────────────────────────┤
│                    HEADER SECTION                        │
│  [Logo] Company Name & Details                          │
│  Address, Contact, GSTIN                                │
├─────────────────────────────────────────────────────────┤
│                    BODY SECTION                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              TABLE LAYOUT                            │ │
│  │  Item Name | Rate | Qty | Amount                    │ │
│  │  ────────────────────────────────────────────────── │ │
│  │  Item 1    | 100  | 2   | 200                       │ │
│  │  Item 2    | 150  | 1   | 150                       │ │
│  └─────────────────────────────────────────────────────┘ │
│  OR                                                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              TEXT LAYOUT                             │ │
│  │  Custom text content for services                   │ │
│  │  or simple invoice descriptions                     │ │
│  └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                    FOOTER SECTION                        │
│              (Terms, thank you message)                 │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### **invoice_templates** Table Layout Configuration

```sql
CREATE TABLE invoice_templates (
    -- Basic Template Info
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(50) UNIQUE NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    template_description TEXT,
    
    -- TOPBAR CONFIGURATION
    topbar_enabled BOOLEAN DEFAULT true,
    topbar_text VARCHAR(255) DEFAULT 'Thank you for your business!',
    topbar_background_color VARCHAR(7) DEFAULT '#f3f4f6',
    topbar_text_color VARCHAR(7) DEFAULT '#374151',
    
    -- HEADER CONFIGURATION
    header_enabled BOOLEAN DEFAULT true,
    header_logo_enabled BOOLEAN DEFAULT true,
    header_company_name_enabled BOOLEAN DEFAULT true,
    header_company_name VARCHAR(255),
    header_company_address TEXT,
    header_company_contact VARCHAR(50),
    header_company_gstin VARCHAR(20),
    header_background_color VARCHAR(7) DEFAULT '#ffffff',
    header_text_color VARCHAR(7) DEFAULT '#111827',
    
    -- BODY CONFIGURATION
    body_layout_type VARCHAR(20) DEFAULT 'table', -- 'table' or 'text'
    body_table_headers_enabled BOOLEAN DEFAULT true,
    body_table_borders_enabled BOOLEAN DEFAULT true,
    body_table_striped BOOLEAN DEFAULT false,
    body_text_content TEXT, -- For text-based layout
    body_background_color VARCHAR(7) DEFAULT '#ffffff',
    body_text_color VARCHAR(7) DEFAULT '#374151',
    
    -- FOOTER CONFIGURATION
    footer_enabled BOOLEAN DEFAULT true,
    footer_text TEXT DEFAULT 'Terms and conditions apply. Thank you for your business!',
    footer_background_color VARCHAR(7) DEFAULT '#f9fafb',
    footer_text_color VARCHAR(7) DEFAULT '#6b7280',
    
    -- Invoice Settings
    default_payment_mode VARCHAR(50) DEFAULT 'Cash',
    tax_rate DECIMAL(5,2) DEFAULT 9.00,
    currency VARCHAR(10) DEFAULT 'INR',
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    primary_color VARCHAR(7) DEFAULT '#dc2626'
);
```

## Layout Section Details

### **1. Topbar Section**
- **Purpose**: Welcome message or promotional text
- **Visibility**: Can be enabled/disabled per template
- **Customization**: Text, background color, text color

**Example Configurations:**
```sql
-- Coffee Shop
topbar_text = 'Brewed with love!'
topbar_background_color = '#fef3c7'
topbar_text_color = '#92400e'

-- Insurance Agency
topbar_text = 'Your protection is our priority!'
topbar_background_color = '#dbeafe'
topbar_text_color = '#1e40af'
```

### **2. Header Section**
- **Purpose**: Company branding and contact information
- **Components**: Logo, company name, address, contact, GSTIN
- **Customization**: Colors, visibility of components

**Example Configurations:**
```sql
-- Retail Store
header_company_name = 'Retail Store'
header_company_address = '123 Main Street, City'
header_company_contact = '+91-9876543210'
header_background_color = '#ffffff'
header_text_color = '#111827'

-- Food Store
header_company_name = 'Food Store'
header_company_address = '456 Market Street, City'
header_company_contact = '+91-9876543211'
header_background_color = '#ffffff'
header_text_color = '#166534'
```

### **3. Body Section**
- **Layout Types**: Table-based or Text-based
- **Table Features**: Headers, borders, striped rows
- **Text Content**: Custom text for services

**Table Layout Example:**
```sql
body_layout_type = 'table'
body_table_headers_enabled = true
body_table_borders_enabled = true
body_table_striped = false
```

**Text Layout Example:**
```sql
body_layout_type = 'text'
body_text_content = 'Service Description: 
- Consultation: 1 hour
- Documentation: Complete
- Follow-up: 30 days'
```

### **4. Footer Section**
- **Purpose**: Terms, conditions, thank you message
- **Customization**: Text content, colors

**Example Configurations:**
```sql
-- Coffee Shop
footer_text = 'Enjoy your coffee! Visit us again soon.'
footer_background_color = '#fef3c7'
footer_text_color = '#92400e'

-- Insurance Agency
footer_text = 'Secure your future with us. Terms apply.'
footer_background_color = '#dbeafe'
footer_text_color = '#1e40af'
```

## Pre-Built Templates

### **System Templates with Layout Configurations**

| Template | Topbar | Header | Body | Footer | Colors |
|----------|--------|--------|------|--------|--------|
| **Retail** | "Welcome to our store!" | Company details | Table layout | "Thank you for shopping!" | Gray theme |
| **Food** | "Fresh groceries delivered!" | Store info | Table layout | "Fresh products guaranteed!" | Green theme |
| **Coffee** | "Brewed with love!" | Cafe details | Table layout | "Enjoy your coffee!" | Brown theme |
| **Insurance** | "Your protection is our priority!" | Agency info | Table layout | "Secure your future!" | Blue theme |
| **Automotive** | "Quality automotive services!" | Service center | Table layout | "Your vehicle is in good hands!" | Gray theme |
| **Fashion** | "Style that defines you!" | Store details | Table layout | "Look good, feel great!" | Pink theme |
| **Electronics** | "Latest technology!" | Store info | Table layout | "Stay connected!" | Purple theme |
| **Toys** | "Fun and learning for kids!" | Store details | Table layout | "Bringing joy to children!" | Orange theme |

## Usage Examples

### **1. Get Complete Template Layout**
```sql
-- Get full template configuration for a store
SELECT * FROM get_store_invoice_template('brew-buddy');

-- Returns layout configuration:
-- topbar_enabled, topbar_text, topbar_background_color, topbar_text_color
-- header_enabled, header_company_name, header_company_address, etc.
-- body_layout_type, body_table_headers_enabled, body_table_borders_enabled
-- footer_enabled, footer_text, footer_background_color, footer_text_color
```

### **2. Create Custom Template**
```sql
-- Create pharmacy template with custom layout
INSERT INTO invoice_templates (
    template_code, template_name, template_description,
    -- Topbar
    topbar_text, topbar_background_color, topbar_text_color,
    -- Header
    header_company_name, header_company_address, header_company_contact,
    -- Body
    body_layout_type, body_table_headers_enabled, body_table_borders_enabled,
    -- Footer
    footer_text, footer_background_color, footer_text_color,
    -- Settings
    invoice_prefix, tax_rate, primary_color
) VALUES (
    'pharmacy', 'Pharmacy Template', 'Template for pharmacy stores',
    'Your health is our priority!', '#f0fdf4', '#166534',
    'Pharmacy Store', '789 Health Street, City', '+91-9876543218',
    'table', true, true,
    'Take care of your health!', '#f0fdf4', '#166534',
    'PH', 12.00, '#10b981'
);
```

### **3. Update Template Layout**
```sql
-- Update coffee shop template with new layout
UPDATE invoice_templates 
SET 
    topbar_text = 'Fresh coffee every morning!',
    topbar_background_color = '#fef3c7',
    header_company_name = 'Morning Coffee Co.',
    footer_text = 'Start your day with us!'
WHERE template_code = 'coffee';
```

## Frontend Integration

### **Invoice Component Layout Rendering**
```typescript
// Get template layout configuration
const template = await this.supabase.getStoreTemplate(storeCode);

// Render topbar if enabled
if (template.topbar_enabled) {
  this.renderTopbar({
    text: template.topbar_text,
    backgroundColor: template.topbar_background_color,
    textColor: template.topbar_text_color
  });
}

// Render header if enabled
if (template.header_enabled) {
  this.renderHeader({
    logoEnabled: template.header_logo_enabled,
    companyName: template.header_company_name,
    address: template.header_company_address,
    contact: template.header_company_contact,
    gstin: template.header_company_gstin,
    backgroundColor: template.header_background_color,
    textColor: template.header_text_color
  });
}

// Render body based on layout type
if (template.body_layout_type === 'table') {
  this.renderTableBody({
    headersEnabled: template.body_table_headers_enabled,
    bordersEnabled: template.body_table_borders_enabled,
    striped: template.body_table_striped,
    backgroundColor: template.body_background_color,
    textColor: template.body_text_color
  });
} else {
  this.renderTextBody({
    content: template.body_text_content,
    backgroundColor: template.body_background_color,
    textColor: template.body_text_color
  });
}

// Render footer if enabled
if (template.footer_enabled) {
  this.renderFooter({
    text: template.footer_text,
    backgroundColor: template.footer_background_color,
    textColor: template.footer_text_color
  });
}
```

## Template Customization

### **Layout Customization Options**

#### **Topbar Customization:**
- Enable/disable topbar
- Custom welcome message
- Background and text colors
- Font styling

#### **Header Customization:**
- Logo display toggle
- Company name and details
- Contact information
- GSTIN display
- Color scheme

#### **Body Customization:**
- **Table Layout**: Headers, borders, striped rows, colors
- **Text Layout**: Custom content, formatting, colors
- Background and text colors

#### **Footer Customization:**
- Custom footer text
- Terms and conditions
- Thank you messages
- Color scheme

### **Color Scheme Examples**

#### **Coffee Shop Theme:**
```sql
topbar_background_color = '#fef3c7'  -- Light yellow
topbar_text_color = '#92400e'        -- Dark brown
header_background_color = '#ffffff'  -- White
header_text_color = '#111827'        -- Dark gray
body_background_color = '#ffffff'    -- White
body_text_color = '#374151'          -- Gray
footer_background_color = '#fef3c7'  -- Light yellow
footer_text_color = '#92400e'        -- Dark brown
```

#### **Insurance Agency Theme:**
```sql
topbar_background_color = '#dbeafe'  -- Light blue
topbar_text_color = '#1e40af'        -- Dark blue
header_background_color = '#ffffff'  -- White
header_text_color = '#111827'        -- Dark gray
body_background_color = '#ffffff'    -- White
body_text_color = '#374151'          -- Gray
footer_background_color = '#dbeafe'  -- Light blue
footer_text_color = '#1e40af'        -- Dark blue
```

## Benefits of Layout-Based System

### ✅ **Visual Consistency**
- Consistent layout structure across all invoices
- Professional appearance with proper branding
- Easy to maintain and update

### ✅ **Flexibility**
- Each section can be customized independently
- Support for both table and text layouts
- Easy color scheme management

### ✅ **Branding**
- Company-specific topbar messages
- Logo and company details in header
- Branded footer messages
- Consistent color schemes

### ✅ **Scalability**
- Templates can be shared across stores
- Easy to create new template types
- Simple layout modifications

This layout-based template system provides a **professional, flexible foundation** for creating branded invoices with consistent visual structure across all business types.

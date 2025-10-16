# Dealer Template Guide

## Overview
The Dealer Template is specifically designed for businesses dealing with bulk products like paint, rice, cement, construction materials, and other dealer/distributor items. This template is based on the R R AGENCY invoice format and includes all necessary fields for GST compliance and bulk product management.

## Template Features

### 🎨 **Visual Design**
- **Color Scheme**: Professional dark theme (#1f2937) with clean white backgrounds
- **Layout**: Table-based layout optimized for product listings
- **Typography**: Clear, readable fonts for business documents

### 📋 **Invoice Structure**

#### **Header Section**
- **Company Name**: R R AGENCY (configurable)
- **Address**: NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407
- **Contact**: +91-9876543218
- **GSTIN**: 37AABCU9603R1Z5
- **Invoice Number**: Auto-generated with DLR prefix
- **Date**: Current date
- **Transport Mode**: Configurable field
- **Vehicle Number**: For delivery tracking
- **State Code**: A.P. Code: 37

#### **Customer Information**
- **Name**: Customer/Dealer name
- **Address**: Complete billing address
- **GSTIN/UIN**: Customer's GST number

#### **Product Table**
- **Serial Number**: Auto-incrementing
- **Product Description**: Detailed product name
- **HSN Code**: Required for GST compliance
- **Quantity**: With units (kg, L, pieces, etc.)
- **Rate**: Price per unit
- **Amount**: Calculated total (Rs. and Ps.)

#### **Tax Calculation**
- **Total Amount Before Tax**: Subtotal
- **SGST**: State Goods and Services Tax
- **CGST**: Central Goods and Services Tax
- **Total Amount After Tax**: Final amount
- **Grand Total**: Total payable amount

#### **Footer Section**
- **Amount in Words**: Total amount written out
- **Bank Details**: 
  - Bank Name: HDFC BANK
  - A/C No: 50200074652200
  - IFSC Code: HDFC0004002
- **Certificate**: "Certificate that the particulars given above are correct"
- **Signature**: Authorized signature space

## Default Products

### 🎨 **Paint Products**
- 8330 HE Paint (250ml) - ₹150.00
- 8267 ASEI Paint (1L) - ₹450.00
- 8270 HIY Paint (250ml) - ₹150.00
- Primer Base Coat - ₹200.00
- Top Coat Finish - ₹180.00

### 🌾 **Rice & Grains**
- Basmati Rice (50kg) - ₹2,500.00
- Regular Rice (50kg) - ₹2,000.00
- Wheat (50kg) - ₹1,800.00
- Dal (25kg) - ₹1,200.00

### 🏗️ **Construction Materials**
- Cement (50kg) - ₹350.00
- Steel Rods (12mm) - ₹500.00 (10 pieces)
- Sand (1 ton) - ₹800.00
- Gravel (1 ton) - ₹600.00
- Bricks (1000 pcs) - ₹5,000.00
- Tiles (1 sq ft) - ₹25.00 (100 pieces)

### 🔧 **Hardware & Tools**
- Nails (1 kg) - ₹80.00
- Screws (1 kg) - ₹120.00
- Wire (100m) - ₹200.00
- Pipe (6ft) - ₹150.00

## Database Setup

### 1. **Run the Setup Script**
```sql
-- Execute the dealer template setup
\i dealer-template-setup.sql
```

### 2. **Verify Installation**
```sql
-- Check template creation
SELECT template_name, template_code FROM invoice_templates WHERE template_code = 'dealer';

-- Check default items
SELECT item_name, default_rate FROM default_items di
JOIN invoice_templates it ON di.template_id = it.id
WHERE it.template_code = 'dealer';

-- Check store creation
SELECT store_name, store_code FROM megha_stores WHERE store_code = 'rragency-bheem';
```

### 3. **Assign Template to Store**
```sql
-- Update existing store to use dealer template
UPDATE megha_stores 
SET invoice_template_id = (SELECT id FROM invoice_templates WHERE template_code = 'dealer')
WHERE store_code = 'your-store-code';
```

## Usage Examples

### **Creating a Paint Invoice**
```sql
INSERT INTO invoices (
    invoice_number, date, store_id, buyer_name, buyer_address,
    subtotal, sgst, cgst, total, items
) VALUES (
    'DLR-002', CURRENT_DATE, 
    (SELECT id FROM megha_stores WHERE store_code = 'rragency-bheem'),
    'Paint Dealer', '123 Paint Street, City',
    750.00, 67.50, 67.50, 885.00,
    '[
        {
            "itemName": "8330 HE Paint (250ml)",
            "quantity": 1,
            "rate": 150.00,
            "amount": 150.00
        },
        {
            "itemName": "8267 ASEI Paint (1L)",
            "quantity": 1,
            "rate": 450.00,
            "amount": 450.00
        }
    ]'::jsonb
);
```

### **Creating a Construction Materials Invoice**
```sql
INSERT INTO invoices (
    invoice_number, date, store_id, buyer_name, buyer_address,
    subtotal, sgst, cgst, total, items
) VALUES (
    'DLR-003', CURRENT_DATE,
    (SELECT id FROM megha_stores WHERE store_code = 'rragency-bheem'),
    'Construction Company', '456 Build Avenue, City',
    5000.00, 450.00, 450.00, 5900.00,
    '[
        {
            "itemName": "Cement (50kg)",
            "quantity": 10,
            "rate": 350.00,
            "amount": 3500.00
        },
        {
            "itemName": "Steel Rods (12mm)",
            "quantity": 20,
            "rate": 500.00,
            "amount": 1000.00
        }
    ]'::jsonb
);
```

## Customization Options

### **Company Information**
```sql
-- Update company details
UPDATE invoice_templates 
SET 
    header_company_name = 'Your Company Name',
    header_company_address = 'Your Address',
    header_company_contact = 'Your Phone',
    header_company_gstin = 'Your GSTIN'
WHERE template_code = 'dealer';
```

### **Bank Details**
```sql
-- Update bank information
UPDATE invoice_templates 
SET footer_text = 'Bank Name: YOUR BANK
A/C No: YOUR_ACCOUNT_NUMBER
IFSC Code: YOUR_IFSC_CODE
Certificate that the particulars given above are correct. For YOUR COMPANY'
WHERE template_code = 'dealer';
```

### **Tax Rates**
```sql
-- Update tax rate
UPDATE invoice_templates 
SET tax_rate = 12.00  -- Change from 18% to 12%
WHERE template_code = 'dealer';
```

## Frontend Integration

### **Angular Component Usage**
```typescript
// Load dealer template configuration
const { data, error } = await this.supabase.getSupabaseClient()
  .rpc('get_dealer_invoice_template');

if (data && data.length > 0) {
  this.templateConfig = data[0];
  this.loadDealerDefaultItems();
}

// Load default items
const { data: items } = await this.supabase.getSupabaseClient()
  .rpc('get_dealer_default_items');
```

### **Template Rendering**
```html
<!-- Dealer-specific invoice form -->
<div class="dealer-invoice-form">
  <!-- Company header with GST details -->
  <div class="company-header">
    <h2>{{ templateConfig.header_company_name }}</h2>
    <p>{{ templateConfig.header_company_address }}</p>
    <p>GSTIN: {{ templateConfig.header_company_gstin }}</p>
  </div>
  
  <!-- Product table with HSN codes -->
  <table class="product-table">
    <thead>
      <tr>
        <th>Sl. No</th>
        <th>Product Description</th>
        <th>HSN Code</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let item of invoiceItems">
        <td>{{ item.serialNumber }}</td>
        <td>{{ item.productDescription }}</td>
        <td>{{ item.hsnCode }}</td>
        <td>{{ item.quantity }} {{ item.unit }}</td>
        <td>{{ item.rate | currency:'INR' }}</td>
        <td>{{ item.amount | currency:'INR' }}</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Best Practices

### **1. HSN Code Management**
- Always include HSN codes for GST compliance
- Maintain a master list of HSN codes for your products
- Update HSN codes when product categories change

### **2. Quantity Units**
- Use consistent units (kg, L, pieces, tons)
- Specify units clearly in product descriptions
- Handle fractional quantities properly

### **3. Tax Calculations**
- Ensure SGST and CGST are calculated correctly
- Round off amounts to nearest rupee
- Maintain tax rate consistency

### **4. Invoice Numbering**
- Use sequential numbering (DLR-001, DLR-002, etc.)
- Include year/month in numbering if required
- Maintain invoice number uniqueness

## Troubleshooting

### **Common Issues**

#### **1. Template Not Loading**
```sql
-- Check if template exists
SELECT * FROM invoice_templates WHERE template_code = 'dealer';

-- Check if store is linked to template
SELECT s.store_name, t.template_name 
FROM megha_stores s
JOIN invoice_templates t ON s.invoice_template_id = t.id
WHERE s.store_code = 'your-store-code';
```

#### **2. Default Items Not Showing**
```sql
-- Check default items
SELECT di.* FROM default_items di
JOIN invoice_templates it ON di.template_id = it.id
WHERE it.template_code = 'dealer';
```

#### **3. Tax Calculation Errors**
```sql
-- Verify tax rate
SELECT tax_rate FROM invoice_templates WHERE template_code = 'dealer';

-- Check if tax calculation is correct
SELECT 
  subtotal,
  (subtotal * tax_rate / 100) as sgst_cgst,
  (subtotal + (subtotal * tax_rate / 100)) as total
FROM invoices WHERE invoice_number = 'DLR-001';
```

## Support

For technical support or customization requests:
- **Email**: support@tekmegha.com
- **Documentation**: [Invoice Template System Guide](./INVOICE_TEMPLATE_SYSTEM_GUIDE.md)
- **Database Schema**: [Invoice Template Schema](./invoice-template-schema-refactored.sql)

---

**Last Updated**: 2024-10-15  
**Version**: 1.0  
**Template Code**: dealer  
**Compatible With**: TekMegha Invoice System v2.0+

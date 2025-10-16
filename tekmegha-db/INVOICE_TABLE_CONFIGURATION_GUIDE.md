# Invoice Table Configuration Guide

## Overview
The invoice template system now supports **configurable table columns** for table-based layouts. When `body_layout_type = 'table'`, you can control which columns are displayed and customize their labels.

## Table Column Configuration

### **Available Columns**
| Column | Default Label | Purpose | Show/Hide Control |
|--------|---------------|---------|-------------------|
| **Product** | "Product" | Item name/description | `table_show_product` |
| **Quantity** | "Qty" | Item quantity | `table_show_quantity` |
| **Rate** | "Rate" | Unit price | `table_show_rate` |
| **Amount** | "Amount" | Rate × Quantity | `table_show_amount` |
| **Discount** | "Discount" | Discount amount | `table_show_discount` |
| **Final Amount** | "Final Amount" | Amount - Discount | `table_show_final_amount` |

### **Column Visibility Controls**
```sql
-- Show/Hide columns
table_show_product BOOLEAN DEFAULT true,
table_show_quantity BOOLEAN DEFAULT true,
table_show_rate BOOLEAN DEFAULT true,
table_show_amount BOOLEAN DEFAULT true,
table_show_discount BOOLEAN DEFAULT false,
table_show_final_amount BOOLEAN DEFAULT false,
```

### **Column Label Customization**
```sql
-- Customize column headers
table_product_label VARCHAR(50) DEFAULT 'Product',
table_quantity_label VARCHAR(50) DEFAULT 'Qty',
table_rate_label VARCHAR(50) DEFAULT 'Rate',
table_amount_label VARCHAR(50) DEFAULT 'Amount',
table_discount_label VARCHAR(50) DEFAULT 'Discount',
table_final_amount_label VARCHAR(50) DEFAULT 'Final Amount',
```

## Template Configurations

### **Basic Table (Retail/Coffee)**
```sql
-- Shows: Product, Qty, Rate, Amount
-- Hides: Discount, Final Amount
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = false,
table_show_final_amount = false,
```

**Result Table:**
```
| Product | Qty | Rate | Amount |
|---------|-----|------|--------|
| Item 1  | 2   | 100  | 200    |
| Item 2  | 1   | 150  | 150    |
```

### **Advanced Table (Food/Insurance/Automotive/Fashion/Electronics)**
```sql
-- Shows: Product, Qty, Rate, Amount, Discount, Final Amount
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
```

**Result Table:**
```
| Product | Qty | Rate | Amount | Discount | Final Amount |
|---------|-----|------|--------|----------|--------------|
| Item 1  | 2   | 100  | 200    | 10       | 190          |
| Item 2  | 1   | 150  | 150    | 5        | 145          |
```

### **Service-Based Table (Insurance/Automotive)**
```sql
-- Custom labels for services
table_product_label = 'Service',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

**Result Table:**
```
| Service | Qty | Rate | Amount | Discount | Final Amount |
|---------|-----|------|--------|----------|--------------|
| Policy  | 1   | 5000 | 5000   | 200      | 4800         |
| Fee     | 1   | 500  | 500    | 0        | 500          |
```

## Template-Specific Configurations

### **1. Retail Store Template**
```sql
-- Basic retail table
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = false,
table_show_final_amount = false,
table_product_label = 'Product',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
```

### **2. Food Store Template**
```sql
-- Advanced food table with discounts
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
table_product_label = 'Item',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

### **3. Coffee Shop Template**
```sql
-- Simple coffee table
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = false,
table_show_final_amount = false,
table_product_label = 'Item',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
```

### **4. Insurance Agency Template**
```sql
-- Service-based table with discounts
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
table_product_label = 'Service',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

### **5. Automotive Template**
```sql
-- Service-based automotive table
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
table_product_label = 'Service',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

### **6. Fashion Store Template**
```sql
-- Fashion items with discounts
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
table_product_label = 'Item',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

### **7. Electronics Store Template**
```sql
-- Electronics with discounts
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = true,
table_show_final_amount = true,
table_product_label = 'Product',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
table_discount_label = 'Discount',
table_final_amount_label = 'Final Amount',
```

### **8. Toy Store Template**
```sql
-- Simple toy table
table_show_product = true,
table_show_quantity = true,
table_show_rate = true,
table_show_amount = true,
table_show_discount = false,
table_show_final_amount = false,
table_product_label = 'Toy',
table_quantity_label = 'Qty',
table_rate_label = 'Rate',
table_amount_label = 'Amount',
```

## Usage Examples

### **Get Template Table Configuration**
```sql
-- Get complete table configuration for a store
SELECT 
    template_code,
    table_show_product,
    table_show_quantity,
    table_show_rate,
    table_show_amount,
    table_show_discount,
    table_show_final_amount,
    table_product_label,
    table_quantity_label,
    table_rate_label,
    table_amount_label,
    table_discount_label,
    table_final_amount_label
FROM get_store_invoice_template('brew-buddy');
```

### **Create Custom Table Configuration**
```sql
-- Create pharmacy template with custom table
INSERT INTO invoice_templates (
    template_code, template_name,
    body_layout_type,
    table_show_product, table_show_quantity, table_show_rate, table_show_amount,
    table_show_discount, table_show_final_amount,
    table_product_label, table_quantity_label, table_rate_label, table_amount_label,
    table_discount_label, table_final_amount_label
) VALUES (
    'pharmacy', 'Pharmacy Template',
    'table',
    true, true, true, true,
    true, true,
    'Medicine', 'Qty', 'Rate', 'Amount',
    'Discount', 'Final Amount'
);
```

### **Update Existing Template**
```sql
-- Update coffee shop to include discounts
UPDATE invoice_templates 
SET 
    table_show_discount = true,
    table_show_final_amount = true,
    table_discount_label = 'Discount',
    table_final_amount_label = 'Final Amount'
WHERE template_code = 'coffee';
```

## Frontend Integration

### **Dynamic Table Rendering**
```typescript
// Get template configuration
const template = await this.supabase.getStoreTemplate(storeCode);

// Build table headers based on configuration
const headers = [];
if (template.table_show_product) {
  headers.push({ key: 'product', label: template.table_product_label });
}
if (template.table_show_quantity) {
  headers.push({ key: 'quantity', label: template.table_quantity_label });
}
if (template.table_show_rate) {
  headers.push({ key: 'rate', label: template.table_rate_label });
}
if (template.table_show_amount) {
  headers.push({ key: 'amount', label: template.table_amount_label });
}
if (template.table_show_discount) {
  headers.push({ key: 'discount', label: template.table_discount_label });
}
if (template.table_show_final_amount) {
  headers.push({ key: 'finalAmount', label: template.table_final_amount_label });
}

// Render table with dynamic columns
this.renderTable(headers, items);
```

### **Table HTML Generation**
```typescript
generateTableHTML(template: any, items: any[]): string {
  let html = '<table class="invoice-table">';
  
  // Generate headers
  html += '<thead><tr>';
  if (template.table_show_product) {
    html += `<th>${template.table_product_label}</th>`;
  }
  if (template.table_show_quantity) {
    html += `<th>${template.table_quantity_label}</th>`;
  }
  if (template.table_show_rate) {
    html += `<th>${template.table_rate_label}</th>`;
  }
  if (template.table_show_amount) {
    html += `<th>${template.table_amount_label}</th>`;
  }
  if (template.table_show_discount) {
    html += `<th>${template.table_discount_label}</th>`;
  }
  if (template.table_show_final_amount) {
    html += `<th>${template.table_final_amount_label}</th>`;
  }
  html += '</tr></thead>';
  
  // Generate rows
  html += '<tbody>';
  items.forEach(item => {
    html += '<tr>';
    if (template.table_show_product) {
      html += `<td>${item.product}</td>`;
    }
    if (template.table_show_quantity) {
      html += `<td>${item.quantity}</td>`;
    }
    if (template.table_show_rate) {
      html += `<td>₹${item.rate}</td>`;
    }
    if (template.table_show_amount) {
      html += `<td>₹${item.amount}</td>`;
    }
    if (template.table_show_discount) {
      html += `<td>₹${item.discount || 0}</td>`;
    }
    if (template.table_show_final_amount) {
      html += `<td>₹${item.finalAmount || item.amount}</td>`;
    }
    html += '</tr>';
  });
  html += '</tbody></table>';
  
  return html;
}
```

## Benefits of Configurable Tables

### ✅ **Flexibility**
- Show/hide columns based on business needs
- Customize column labels for different industries
- Support both simple and complex table layouts

### ✅ **Industry-Specific**
- Retail: Product, Qty, Rate, Amount
- Services: Service, Qty, Rate, Amount, Discount, Final Amount
- Food: Item, Qty, Rate, Amount, Discount, Final Amount
- Insurance: Service, Qty, Rate, Amount, Discount, Final Amount

### ✅ **User Experience**
- Clean, uncluttered tables for simple businesses
- Detailed tables for complex businesses
- Consistent labeling across templates

### ✅ **Maintainability**
- Easy to update table configurations
- Template-specific customizations
- Centralized table management

This configurable table system provides **maximum flexibility** while maintaining **consistency** across different business types and invoice requirements.

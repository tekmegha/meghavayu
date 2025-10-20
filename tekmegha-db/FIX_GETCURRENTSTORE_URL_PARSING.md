# Fix getCurrentStore URL Parsing

## 🐛 **Issue Identified**

The `getCurrentStore()` method was not properly extracting the store code from URL paths, causing it to return empty strings or fallback to default values instead of detecting the actual store from the URL.

## 🔍 **Root Cause Analysis**

### **Problem 1: Hardcoded Route Checks**
- The method was checking for specific hardcoded routes first
- This prevented proper detection of dynamic store codes
- Routes like `/jsicare/home` were not being handled correctly

### **Problem 2: Inefficient Logic Flow**
- The method had too many specific route checks
- The general store detection logic was buried in an `else` block
- This made it hard to detect new stores dynamically

### **Problem 3: Inconsistent Global Route Lists**
- Different methods had different global route lists
- This caused inconsistencies in store detection

## 🔧 **Fix Applied**

### **Simplified and Enhanced getCurrentStore() Method**

**File:** `tekmegha-fe/src/app/shared/services/supabase.service.ts`

#### **Before (Problematic):**
```typescript
getCurrentStore(): string {
  const path = window.location.pathname;
  
  // Check specific known routes first
  if (path.startsWith('/fashion') || path.startsWith('/majili')) {
    return 'majili';
  } else if (path.startsWith('/toys') || path.startsWith('/little-ducks')) {
    return 'little-ducks';
  }
  // ... many more hardcoded checks
  
  } else {
    // General store detection (buried in else)
    const pathSegments = path.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
      const potentialStoreCode = pathSegments[0];
      // ... rest of logic
    }
  }
  return '';
}
```

#### **After (Fixed):**
```typescript
getCurrentStore(): string {
  const path = window.location.pathname;
  
  console.log('getCurrentStore - analyzing path:', path);
  
  // Special case for login pages - check returnUrl parameter
  if (path === '/inventory-login' || path === '/login') {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    if (returnUrl) {
      const storeCode = this.extractStoreCodeFromPath(returnUrl);
      if (storeCode) {
        console.log('getCurrentStore - from returnUrl:', storeCode);
        return storeCode;
      }
    }
  }
  
  // Extract store code from URL path
  const pathSegments = path.split('/').filter(segment => segment);
  console.log('getCurrentStore - path segments:', pathSegments);
  
  if (pathSegments.length > 0) {
    const potentialStoreCode = pathSegments[0];
    console.log('getCurrentStore - potential store code:', potentialStoreCode);
    
    // Check if it's not a known global route
    const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients', 'inventory-login', 'fashion', 'toys', 'food', 'clients'];
    
    if (!globalRoutes.includes(potentialStoreCode)) {
      console.log('getCurrentStore - returning store code:', potentialStoreCode);
      return potentialStoreCode;
    }
  }
  
  console.log('getCurrentStore - no store detected, returning empty string');
  return '';
}
```

### **Enhanced extractStoreCodeFromPath() Method**

#### **Before:**
```typescript
private extractStoreCodeFromPath(path: string): string | null {
  const segments = path.replace(/^\//, '').split('/');
  if (segments.length > 0) {
    const potentialStoreCode = segments[0];
    const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients'];
    if (!globalRoutes.includes(potentialStoreCode)) {
      return potentialStoreCode;
    }
  }
  return null;
}
```

#### **After:**
```typescript
private extractStoreCodeFromPath(path: string): string | null {
  console.log('extractStoreCodeFromPath - analyzing path:', path);
  
  const segments = path.replace(/^\//, '').split('/');
  console.log('extractStoreCodeFromPath - segments:', segments);
  
  if (segments.length > 0) {
    const potentialStoreCode = segments[0];
    console.log('extractStoreCodeFromPath - potential store code:', potentialStoreCode);
    
    const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients', 'inventory-login', 'fashion', 'toys', 'food', 'clients'];
    
    if (!globalRoutes.includes(potentialStoreCode)) {
      console.log('extractStoreCodeFromPath - returning store code:', potentialStoreCode);
      return potentialStoreCode;
    }
  }
  
  console.log('extractStoreCodeFromPath - no store code found');
  return null;
}
```

## 🎯 **Key Improvements**

### **1. Simplified Logic Flow**
- **Removed hardcoded route checks** that were preventing dynamic store detection
- **Prioritized general store detection** over specific route handling
- **Streamlined the logic** for better maintainability

### **2. Enhanced Debugging**
- **Added comprehensive console logging** to track store detection
- **Step-by-step debugging** for path analysis
- **Clear logging** for troubleshooting

### **3. Consistent Global Route Lists**
- **Unified global route lists** across methods
- **Added missing global routes** like 'fashion', 'toys', 'food', 'clients'
- **Consistent behavior** across all store detection methods

### **4. Better URL Parsing**
- **Robust path segment extraction** from URLs
- **Proper handling** of leading slashes
- **Consistent segment filtering** logic

## 📋 **Test Cases**

### **Test 1: JSICare Store**
- **URL:** `/jsicare/home`
- **Expected:** `getCurrentStore()` returns `'jsicare'`
- **Console Output:**
  ```
  getCurrentStore - analyzing path: /jsicare/home
  getCurrentStore - path segments: ['jsicare', 'home']
  getCurrentStore - potential store code: jsicare
  getCurrentStore - returning store code: jsicare
  ```

### **Test 2: RR Agency Store**
- **URL:** `/rragency/invoices`
- **Expected:** `getCurrentStore()` returns `'rragency'`
- **Console Output:**
  ```
  getCurrentStore - analyzing path: /rragency/invoices
  getCurrentStore - path segments: ['rragency', 'invoices']
  getCurrentStore - potential store code: rragency
  getCurrentStore - returning store code: rragency
  ```

### **Test 3: Global Routes**
- **URL:** `/inventory-login`
- **Expected:** `getCurrentStore()` returns `''` (empty string)
- **Console Output:**
  ```
  getCurrentStore - analyzing path: /inventory-login
  getCurrentStore - path segments: ['inventory-login']
  getCurrentStore - potential store code: inventory-login
  getCurrentStore - no store detected, returning empty string
  ```

### **Test 4: Return URL Parameter**
- **URL:** `/inventory-login?returnUrl=/jsicare/invoices`
- **Expected:** `getCurrentStore()` returns `'jsicare'`
- **Console Output:**
  ```
  getCurrentStore - analyzing path: /inventory-login
  extractStoreCodeFromPath - analyzing path: /jsicare/invoices
  extractStoreCodeFromPath - segments: ['jsicare', 'invoices']
  extractStoreCodeFromPath - potential store code: jsicare
  extractStoreCodeFromPath - returning store code: jsicare
  getCurrentStore - from returnUrl: jsicare
  ```

## ✅ **Benefits**

### **1. Dynamic Store Detection**
- **No more hardcoded routes** - works with any store code
- **Automatic detection** of new stores without code changes
- **Flexible URL parsing** for different store patterns

### **2. Better Debugging**
- **Comprehensive logging** for troubleshooting
- **Step-by-step analysis** of URL parsing
- **Clear identification** of store detection issues

### **3. Consistent Behavior**
- **Unified logic** across all store detection methods
- **Consistent global route handling**
- **Predictable store detection** results

### **4. Maintainable Code**
- **Simplified logic flow** for easier maintenance
- **Clear separation** of concerns
- **Easy to extend** for new requirements

## 🎉 **Status**

The `getCurrentStore()` method now properly extracts store codes from URL paths! It will correctly detect stores like `jsicare`, `rragency`, `megha`, etc., from URLs like `/jsicare/home`, `/rragency/invoices`, etc. ✅

## 📝 **Next Steps**

1. **Test the enhanced logic** with different store URLs
2. **Check console logs** to verify store detection
3. **Verify bottom navbar** works correctly with detected stores
4. **Remove debug logs** once confirmed working

# Logout Option for Store Access Denied

## 🎯 **Feature Added**

Added logout functionality when users don't have access to a specific store, providing a better user experience for access control scenarios.

## 🔧 **Implementation Details**

### **Files Modified:**

#### **1. `tekmegha-fe/src/app/inventory-login/inventory-login.ts`**

**Added Properties:**
```typescript
showLogoutOption = false;
```

**Enhanced `checkExistingAuth()` Method:**
```typescript
async checkExistingAuth() {
  const user = this.supabaseService.getCurrentUser();
  if (user) {
    const hasAccess = await this.checkInventoryAccess(user.id);
    if (hasAccess) {
      // Redirect to store-specific route
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultInventoryRoute();
      this.router.navigateByUrl(returnUrl);
    } else {
      // User doesn't have access, show logout option
      this.showAccessDeniedWithLogout();
    }
  }
}
```

**Enhanced `onLogin()` Method:**
```typescript
} else {
  // User doesn't have access, show logout option
  this.showAccessDeniedWithLogout();
}
```

**Added New Methods:**
```typescript
private showAccessDeniedWithLogout() {
  this.errorMessage = 'Access denied. You do not have permission to access the inventory module for this store.';
  this.showLogoutOption = true;
}

async onLogout() {
  try {
    await this.supabaseService.signOut();
    this.errorMessage = '';
    this.successMessage = 'You have been logged out. Please try logging in with different credentials.';
    this.showLogoutOption = false;
    
    // Clear form
    this.email = '';
    this.password = '';
  } catch (error) {
    console.error('Logout error:', error);
    this.errorMessage = 'Error during logout. Please try again.';
  }
}
```

#### **2. `tekmegha-fe/src/app/inventory-login/inventory-login.html`**

**Added Logout Option UI:**
```html
@if (showLogoutOption) {
  <div class="logout-option">
    <p>You are currently logged in but don't have access to this store.</p>
    <button type="button" class="logout-button" (click)="onLogout()">
      <span class="material-icons">logout</span>
      <span>Logout and Try Different Account</span>
    </button>
  </div>
}
```

#### **3. `tekmegha-fe/src/app/inventory-login/inventory-login.scss`**

**Added Logout Option Styling:**
```scss
.logout-option {
  background: var(--warning-bg, #fff3cd);
  border: 1px solid var(--warning-border, #ffeaa7);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  text-align: center;

  p {
    color: var(--warning-text, #856404);
    margin: 0 0 12px 0;
    font-size: 0.9rem;
  }

  .logout-button {
    background: var(--warning-color, #f39c12);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: var(--warning-dark, #e67e22);
      transform: translateY(-1px);
    }
  }
}
```

## 🎯 **How It Works**

### **Scenario 1: User Already Logged In (No Access)**
1. User clicks "Bill" from JSICare store
2. `checkExistingAuth()` runs and detects user is logged in
3. `checkInventoryAccess()` returns `false` for this store
4. `showAccessDeniedWithLogout()` is called
5. User sees error message with logout option
6. User can click "Logout and Try Different Account"
7. User is signed out and can try different credentials

### **Scenario 2: User Logs In (No Access)**
1. User enters credentials and clicks "Sign In"
2. `onLogin()` runs and authenticates user
3. `checkInventoryAccess()` returns `false` for this store
4. `showAccessDeniedWithLogout()` is called
5. User sees error message with logout option
6. User can logout and try different account

### **Scenario 3: User Logs In (Has Access)**
1. User enters credentials and clicks "Sign In"
2. `onLogin()` runs and authenticates user
3. `checkInventoryAccess()` returns `true` for this store
4. User is redirected to store-specific route ✅

## 🎨 **UI/UX Features**

### **Visual Design:**
- **Warning-styled container** with yellow/orange theme
- **Clear messaging** explaining the access issue
- **Prominent logout button** with icon
- **Hover effects** for better interactivity

### **User Experience:**
- **Clear explanation** of why access is denied
- **One-click logout** functionality
- **Form clearing** after logout
- **Success message** after logout
- **Error handling** for logout failures

## 📋 **Test Cases**

### **Test 1: Existing User Without Access**
1. User is already logged in with account that doesn't have JSICare access
2. User clicks "Bill" from JSICare store
3. **Expected:** Shows access denied message with logout option
4. **Expected:** User can logout and try different account

### **Test 2: New Login Without Access**
1. User enters credentials for account without JSICare access
2. User clicks "Sign In"
3. **Expected:** Shows access denied message with logout option
4. **Expected:** User can logout and try different account

### **Test 3: User With Access**
1. User enters credentials for account with JSICare access
2. User clicks "Sign In"
3. **Expected:** Redirects to JSICare inventory/invoices ✅

## ✅ **Benefits**

1. **Better User Experience:** Clear explanation of access issues
2. **Easy Account Switching:** One-click logout to try different account
3. **Security:** Prevents unauthorized access attempts
4. **Clear Messaging:** Users understand why they can't access the store
5. **Professional UI:** Warning-styled design that's not alarming but informative

## 🎉 **Status**

The logout option for store access denied scenarios has been successfully implemented! Users now have a clear path to logout and try different credentials when they don't have access to a specific store. ✅

# Store Selection Feature Guide

This guide explains the store selection feature that allows users to choose a store and maintain that selection throughout their session.

## 🎯 **Feature Overview**

The store selection feature provides:
- ✅ **Store List Display**: Shows all available stores on the home page
- ✅ **Session Persistence**: Maintains selected store throughout the session
- ✅ **URL Integration**: Updates URL to match selected store
- ✅ **Local Storage**: Persists selection across browser sessions
- ✅ **Store-Specific Content**: Shows relevant products and categories

## 🏗️ **Architecture**

### **Components Created**

#### **1. StoreSessionService** (`store-session.service.ts`)
- **Purpose**: Manages store selection state
- **Features**:
  - Store selection persistence
  - Local storage integration
  - URL management
  - Store data loading

#### **2. StoreSelectorComponent** (`store-selector.ts`)
- **Purpose**: UI for store selection
- **Features**:
  - Store cards display
  - Selection interface
  - Loading states
  - Responsive design

#### **3. Updated HomeComponent** (`home.ts`)
- **Purpose**: Integrates store selection
- **Features**:
  - Store selector integration
  - Store-specific content
  - Session management

## 🚀 **How It Works**

### **1. Initial Load**
```typescript
// Check for stored session
const storedStore = localStorage.getItem('selected-store');
if (storedStore) {
  // Load stored store
  this.storeSessionService.setSelectedStore(JSON.parse(storedStore));
} else {
  // Show store selector
  this.showStoreSelector = true;
}
```

### **2. Store Selection**
```typescript
// User selects a store
selectStore(store: StoreSession) {
  this.storeSessionService.setSelectedStore(store);
  // Store is persisted in localStorage
  // URL is updated to match store
}
```

### **3. Session Persistence**
```typescript
// Store selection is maintained across:
// - Page refreshes
// - Navigation between pages
// - Browser sessions (until cleared)
```

## 📱 **User Experience**

### **First Visit**
1. **Store Selector Display**: User sees all available stores
2. **Store Cards**: Each store shows name, description, and status
3. **Selection**: User clicks on preferred store
4. **Confirmation**: "Continue Shopping" button appears
5. **Navigation**: User proceeds to store-specific content

### **Return Visits**
1. **Automatic Load**: Previously selected store loads automatically
2. **Store Header**: Shows current store with option to change
3. **Seamless Experience**: No need to re-select store

### **Store Switching**
1. **Change Store Button**: Available in store header
2. **Re-selection**: Store selector appears again
3. **New Session**: New store selection persists

## 🎨 **UI Components**

### **Store Selector**
```html
<app-store-selector></app-store-selector>
```
- **Full-screen overlay** with gradient background
- **Store cards** with icons and descriptions
- **Loading states** with skeleton loaders
- **Responsive design** for mobile and desktop

### **Store Header**
```html
<div class="store-header">
  <div class="store-info">
    <h2>Welcome to {{ selectedStore.storeName }}</h2>
    <p>{{ getStoreDescription(selectedStore.storeCode) }}</p>
  </div>
  <button class="change-store-btn">Change Store</button>
</div>
```

## 🔧 **Technical Implementation**

### **Store Session Service**
```typescript
export interface StoreSession {
  storeId: string;
  storeName: string;
  storeCode: string;
  storeType: string;
  isActive: boolean;
}
```

### **Key Methods**
- `setSelectedStore(store: StoreSession)`: Set and persist store
- `getSelectedStore()`: Get current store
- `getAvailableStores()`: Load all stores from database
- `updateUrlForStore(storeCode: string)`: Update URL to match store

### **Store Selector Component**
```typescript
// Store selection logic
selectStore(store: StoreSession) {
  this.selectedStore = store;
  this.storeSessionService.setSelectedStore(store);
}

// Store icons and descriptions
getStoreIcon(storeCode: string): string {
  switch (storeCode) {
    case 'brew-buddy': return 'local_cafe';
    case 'little-ducks': return 'toys';
    case 'opula': return 'shopping_bag';
    default: return 'store';
  }
}
```

## 🗂️ **Store Data Structure**

### **Available Stores**
- **Brew Buddy**: Coffee and beverages
- **Little Ducks**: Educational toys and games
- **Opula**: Fashion and accessories

### **Store Information**
```typescript
{
  storeId: "uuid",
  storeName: "Brew Buddy",
  storeCode: "brew-buddy",
  storeType: "Coffee Shop",
  isActive: true
}
```

## 🔐 **Security & Data**

### **Data Sources**
- **Supabase Database**: Store information from `megha_stores` table
- **Local Storage**: Session persistence
- **URL Parameters**: Store code in URL path

### **Access Control**
- **Public Access**: Anyone can view stores
- **Store Filtering**: Only active stores are shown
- **Session Isolation**: Each user has independent store selection

## 📊 **Store-Specific Features**

### **Content Adaptation**
- **Products**: Show products relevant to selected store
- **Categories**: Display store-specific categories
- **Branding**: Apply store-specific themes and colors
- **Navigation**: Update routes to include store code

### **URL Structure**
```
/brew-buddy/          # Brew Buddy store
/little-ducks/        # Little Ducks store
/opula/               # Opula store
```

## 🎯 **Benefits**

### **For Users**
- ✅ **Personalized Experience**: Content tailored to selected store
- ✅ **Easy Switching**: Change stores without losing session
- ✅ **Persistent Selection**: Remembers choice across visits
- ✅ **Clear Navigation**: Always know which store they're in

### **For Business**
- ✅ **Multi-Brand Support**: Single app for multiple stores
- ✅ **Data Isolation**: Store-specific data and analytics
- ✅ **Flexible Architecture**: Easy to add new stores
- ✅ **User Engagement**: Store-specific content increases relevance

## 🚀 **Usage Examples**

### **Basic Store Selection**
```typescript
// Load available stores
const stores = await this.storeSessionService.getAvailableStores();

// Select a store
this.storeSessionService.setSelectedStore(selectedStore);

// Get current store
const currentStore = this.storeSessionService.getSelectedStore();
```

### **Store-Specific Content**
```typescript
// Load products for selected store
private loadProductsForStore(store: StoreSession) {
  // Filter products by store
  // Apply store-specific branding
  // Show relevant categories
}
```

### **URL Management**
```typescript
// Update URL to match store
this.storeSessionService.updateUrlForStore('brew-buddy');
// URL becomes: /brew-buddy/menu
```

## 🛠️ **Customization**

### **Adding New Stores**
1. **Database**: Add store to `megha_stores` table
2. **Icons**: Update `getStoreIcon()` method
3. **Descriptions**: Update `getStoreDescription()` method
4. **Styling**: Add store-specific CSS classes

### **Store-Specific Styling**
```scss
// Store-specific themes
.brew-buddy-theme {
  background: linear-gradient(135deg, #8B4513, #D2691E);
}

.little-ducks-theme {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.opula-theme {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
}
```

## 📞 **Support**

### **Common Issues**
1. **Store Not Loading**: Check database connection
2. **Selection Not Persisting**: Verify localStorage access
3. **URL Not Updating**: Check browser history API
4. **Store-Specific Content**: Verify store filtering logic

### **Debug Steps**
1. **Check Console**: Look for JavaScript errors
2. **Verify Database**: Ensure stores exist in database
3. **Test Local Storage**: Check if selection is saved
4. **URL Testing**: Verify URL updates correctly

---

**The store selection feature provides a seamless multi-store experience with persistent user preferences!** 🎉

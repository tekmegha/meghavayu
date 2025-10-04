# Dynamic Layout System Guide

This guide explains the dynamic layout system that automatically launches the appropriate layout component based on the selected store.

## 🎯 **System Overview**

The dynamic layout system provides:
- ✅ **Automatic Layout Selection**: Chooses layout based on selected store
- ✅ **Store-Specific Theming**: Applies appropriate colors and styles
- ✅ **URL Integration**: Updates URLs to include store codes
- ✅ **Seamless Switching**: Changes layout when store is switched
- ✅ **Brand Consistency**: Maintains store-specific branding throughout

## 🏗️ **Architecture**

### **Components Created**

#### **1. DynamicLayoutComponent** (`dynamic-layout.ts`)
- **Purpose**: Main layout switcher
- **Features**:
  - Conditional layout rendering
  - Store-based layout selection
  - Router outlet management
  - Layout transitions

#### **2. Updated HomeComponent** (`home.ts`)
- **Purpose**: Integrates with dynamic layout
- **Features**:
  - Brand initialization
  - Theme application
  - URL management
  - Store-specific content

#### **3. Updated App Routes** (`app.routes.ts`)
- **Purpose**: Store-specific routing
- **Features**:
  - Dynamic layout routing
  - Store code in URLs
  - Nested route structure

## 🎨 **Layout Mapping**

### **Store to Layout Mapping**
```typescript
// Brew Buddy (Default)
selectedStore.storeCode === 'brew-buddy' → Layout (Default)

// Little Ducks (Toys)
selectedStore.storeCode === 'little-ducks' → LayoutToys

// Opula (Fashion)
selectedStore.storeCode === 'opula' → LayoutFashion
```

### **Layout Components**
- **Layout**: Default layout for Brew Buddy (coffee theme)
- **LayoutToys**: Toys-themed layout for Little Ducks
- **LayoutFashion**: Fashion-themed layout for Opula

## 🚀 **How It Works**

### **1. Store Selection**
```typescript
// User selects a store
this.storeSessionService.setSelectedStore(store);

// Home component detects change
this.storeSessionService.selectedStore$.subscribe(store => {
  this.initializeBrandForStore(store);
});
```

### **2. Brand Initialization**
```typescript
private initializeBrandForStore(store: StoreSession) {
  // Set brand service
  this.brandService.setBrand(store.storeCode);
  
  // Apply theme to body
  document.body.classList.add(`${store.storeCode}-theme`);
  
  // Update URL
  this.router.navigateByUrl(`/${store.storeCode}/home`);
}
```

### **3. Layout Rendering**
```html
<!-- Dynamic layout component -->
<app-dynamic-layout>
  <!-- Brew Buddy Layout -->
  <app-layout *ngIf="selectedStore?.storeCode === 'brew-buddy'">
    <router-outlet></router-outlet>
  </app-layout>

  <!-- Little Ducks Layout -->
  <app-layout-toys *ngIf="selectedStore?.storeCode === 'little-ducks'">
    <router-outlet></router-outlet>
  </app-layout-toys>

  <!-- Opula Layout -->
  <app-layout-fashion *ngIf="selectedStore?.storeCode === 'opula'">
    <router-outlet></router-outlet>
  </app-layout-fashion>
</app-dynamic-layout>
```

## 🎨 **Theme System**

### **Store-Specific Themes**
```scss
// Brew Buddy Theme
.brew-buddy-theme {
  --primary-color: #8B4513;
  --secondary-color: #D2691E;
  --accent-color: #FF6600;
}

// Little Ducks Theme
.little-ducks-theme {
  --primary-color: #FFD700;
  --secondary-color: #FFA500;
  --accent-color: #FF6B35;
}

// Opula Theme
.opula-theme {
  --primary-color: #FF69B4;
  --secondary-color: #FF1493;
  --accent-color: #E91E63;
}
```

### **Theme Application**
```typescript
// Apply theme to body element
document.body.className = document.body.className.replace(/-\w+-theme/g, '');
document.body.classList.add(`${store.storeCode}-theme`);
```

## 🔗 **URL Structure**

### **URL Patterns**
```
/                          # Default (Brew Buddy)
/home                      # Default home
/brew-buddy/home           # Brew Buddy home
/brew-buddy/menu           # Brew Buddy menu
/little-ducks/home         # Little Ducks home
/little-ducks/menu         # Little Ducks menu
/opula/home                # Opula home
/opula/menu                # Opula menu
```

### **URL Management**
```typescript
// Update URL to include store code
const currentPath = window.location.pathname;
if (!currentPath.includes(`/${store.storeCode}`)) {
  const newPath = `/${store.storeCode}${currentPath}`;
  this.router.navigateByUrl(newPath, { replaceUrl: true });
}
```

## 📱 **User Experience**

### **First Visit**
1. **Store Selector**: User sees store selection screen
2. **Store Selection**: User chooses preferred store
3. **Layout Launch**: Appropriate layout loads automatically
4. **Theme Application**: Store-specific theme is applied
5. **URL Update**: URL includes store code

### **Store Switching**
1. **Change Store**: User clicks "Change Store" button
2. **Store Selector**: Store selection screen appears
3. **New Selection**: User selects different store
4. **Layout Switch**: New layout loads with transition
5. **Theme Update**: New theme is applied
6. **URL Update**: URL updates to new store

### **Return Visits**
1. **Automatic Load**: Previously selected store loads
2. **Layout Restoration**: Correct layout is restored
3. **Theme Application**: Store theme is applied
4. **Seamless Experience**: No re-selection needed

## 🎯 **Layout Features**

### **Brew Buddy Layout (Default)**
- **Coffee Theme**: Brown and orange color scheme
- **Coffee Icons**: Coffee-related navigation icons
- **Beverage Categories**: Coffee, tea, pastries
- **Warm Colors**: Earth tones and warm accents

### **Little Ducks Layout (Toys)**
- **Toys Theme**: Bright yellow and orange colors
- **Toy Icons**: Toy-related navigation icons
- **Educational Categories**: Toys, games, educational
- **Playful Colors**: Bright and cheerful tones

### **Opula Layout (Fashion)**
- **Fashion Theme**: Pink and magenta color scheme
- **Fashion Icons**: Fashion-related navigation icons
- **Fashion Categories**: Clothing, accessories, jewelry
- **Elegant Colors**: Sophisticated and trendy tones

## 🔧 **Technical Implementation**

### **Dynamic Layout Component**
```typescript
@Component({
  selector: 'app-dynamic-layout',
  template: `
    <!-- Conditional layout rendering -->
    <app-layout *ngIf="!selectedStore || selectedStore.storeCode === 'brew-buddy'">
      <router-outlet></router-outlet>
    </app-layout>
    
    <app-layout-fashion *ngIf="selectedStore?.storeCode === 'opula'">
      <router-outlet></router-outlet>
    </app-layout-fashion>
    
    <app-layout-toys *ngIf="selectedStore?.storeCode === 'little-ducks'">
      <router-outlet></router-outlet>
    </app-layout-toys>
  `
})
export class DynamicLayoutComponent {
  selectedStore: StoreSession | null = null;
  
  constructor(private storeSessionService: StoreSessionService) {}
}
```

### **Route Configuration**
```typescript
export const routes: Routes = [
  // Store-specific routes
  { path: 'brew-buddy', component: DynamicLayoutComponent, children: [
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    // ... other routes
  ]},
  { path: 'little-ducks', component: DynamicLayoutComponent, children: [
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    // ... other routes
  ]},
  { path: 'opula', component: DynamicLayoutComponent, children: [
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    // ... other routes
  ]}
];
```

## 🎨 **Styling System**

### **CSS Custom Properties**
```scss
:host-context(.brew-buddy-theme) {
  --primary-color: #8B4513;
  --secondary-color: #D2691E;
  --accent-color: #FF6600;
}

:host-context(.little-ducks-theme) {
  --primary-color: #FFD700;
  --secondary-color: #FFA500;
  --accent-color: #FF6B35;
}

:host-context(.opula-theme) {
  --primary-color: #FF69B4;
  --secondary-color: #FF1493;
  --accent-color: #E91E63;
}
```

### **Layout Transitions**
```scss
.layout-transition {
  animation: layoutSwitch 0.3s ease-in-out;
}

@keyframes layoutSwitch {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## 🚀 **Benefits**

### **For Users**
- ✅ **Consistent Experience**: Same app, different stores
- ✅ **Store-Specific Branding**: Each store has its own look and feel
- ✅ **Easy Switching**: Change stores without losing context
- ✅ **Familiar Navigation**: Same structure, different themes

### **For Business**
- ✅ **Multi-Brand Support**: Single app for multiple brands
- ✅ **Brand Consistency**: Each store maintains its identity
- ✅ **Flexible Architecture**: Easy to add new stores
- ✅ **Unified Management**: Single codebase for all stores

## 🛠️ **Customization**

### **Adding New Stores**
1. **Create Layout Component**: New layout for the store
2. **Update Dynamic Layout**: Add condition for new store
3. **Add Routes**: Include new store in routing
4. **Create Theme**: Add store-specific CSS variables
5. **Update Brand Service**: Add store configuration

### **Store-Specific Features**
```typescript
// Store-specific content loading
private loadProductsForStore(store: StoreSession) {
  switch (store.storeCode) {
    case 'brew-buddy':
      // Load coffee products
      break;
    case 'little-ducks':
      // Load toy products
      break;
    case 'opula':
      // Load fashion products
      break;
  }
}
```

## 📊 **Performance**

### **Layout Switching**
- ✅ **Fast Transitions**: Smooth layout changes
- ✅ **Lazy Loading**: Layouts load on demand
- ✅ **Memory Efficient**: Unused layouts are not rendered
- ✅ **Cached Themes**: Theme styles are cached

### **Optimization**
- ✅ **Conditional Rendering**: Only active layout is rendered
- ✅ **Theme Switching**: CSS classes for fast theme changes
- ✅ **Route Caching**: Routes are cached for performance
- ✅ **Component Reuse**: Same components, different layouts

## 📞 **Support**

### **Common Issues**
1. **Layout Not Switching**: Check store selection service
2. **Theme Not Applied**: Verify CSS class application
3. **URL Not Updating**: Check router navigation
4. **Layout Not Loading**: Verify route configuration

### **Debug Steps**
1. **Check Store Selection**: Verify store is selected
2. **Inspect DOM**: Check if correct layout is rendered
3. **Check Console**: Look for JavaScript errors
4. **Verify Routes**: Ensure routes are configured correctly

---

**The dynamic layout system provides seamless multi-store experience with automatic layout switching and store-specific theming!** 🎉

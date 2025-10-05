import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Menu } from './menu/menu';
import { Cart } from './cart/cart';
import { Stores } from './stores/stores';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Inventory } from './inventory/inventory';
import { InventoryLogin } from './inventory-login/inventory-login';
import { TekMeghaClientsComponent } from './tekmegha-clients/tekmegha-clients';
import { InventoryAuthGuard } from './shared/guards/inventory-auth.guard';
import { DynamicLayoutComponent } from './shared/dynamic-layout/dynamic-layout';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Default routes with dynamic layout (Brew Buddy as default)
  { path: 'home', component: DynamicLayoutComponent, children: [
    { path: '', component: Home }
  ]},
  { path: 'menu', component: DynamicLayoutComponent, children: [
    { path: '', component: Menu }
  ]},
  { path: 'cart', component: DynamicLayoutComponent, children: [
    { path: '', component: Cart }
  ]},
  { path: 'stores', component: DynamicLayoutComponent, children: [
    { path: '', component: Stores }
  ]},
  { path: 'profile', component: DynamicLayoutComponent, children: [
    { path: '', component: Profile }
  ]},
  { path: 'login', component: DynamicLayoutComponent, children: [
    { path: '', component: Login }
  ]},
  { path: 'inventory-login', component: InventoryLogin },
  { path: 'inventory', component: DynamicLayoutComponent, children: [
    { path: '', component: Inventory }
  ], canActivate: [InventoryAuthGuard] },
  { path: 'tekmegha-clients', component: DynamicLayoutComponent, children: [
    { path: '', component: TekMeghaClientsComponent }
  ]},
  
  // Store-specific routes with dynamic layout
  { path: 'brew-buddy', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'little-ducks', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'opula', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'cctv-device', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'fashion', redirectTo: '/opula', pathMatch: 'full' },
  { path: 'toys', redirectTo: '/little-ducks', pathMatch: 'full' }
];

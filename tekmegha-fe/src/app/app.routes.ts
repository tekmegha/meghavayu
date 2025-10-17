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
import { CustomerAuthGuard } from './shared/guards/customer-auth.guard';
import { DynamicLayoutComponent } from './shared/dynamic-layout/dynamic-layout';
import { InsurancesComponent } from './insurances/insurances';
import { InvoiceComponent } from './invoice/invoice';
import { InvoicesComponent } from './invoices/invoices';
import { PetCareServicesComponent } from './pet-care-services/pet-care-services';

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
  // Global invoices route
  { path: 'invoices', component: DynamicLayoutComponent, children: [
    { path: '', component: InvoicesComponent }
  ], canActivate: [InventoryAuthGuard] },
  
  // Global invoice routes
  { path: 'invoice', component: DynamicLayoutComponent, children: [
    { path: 'new', component: InvoiceComponent },
    { path: 'edit/:id', component: InvoiceComponent },
    { path: 'view/:id', component: InvoiceComponent },
    { path: 'print/:id', component: InvoiceComponent }
  ], canActivate: [InventoryAuthGuard] },
  { path: 'tekmegha-clients', component: TekMeghaClientsComponent},
  
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
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
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
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'majili', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
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
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'royalfoods', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'automobile-insurance', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'insurances', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'dkassociates', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'insurances', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'paws-nexus', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: PetCareServicesComponent },
    { path: 'services', component: PetCareServicesComponent },
    { path: 'doctors', component: PetCareServicesComponent },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'fashion', redirectTo: '/majili', pathMatch: 'full' },
  { path: 'toys', redirectTo: '/little-ducks', pathMatch: 'full' },
  { path: 'food', redirectTo: '/royalfoods', pathMatch: 'full' },
  { path: 'insurance', redirectTo: '/automobile-insurance', pathMatch: 'full' },
  { path: 'petcare', redirectTo: '/paws-nexus', pathMatch: 'full' },
  
  // Wildcard route for any store code that doesn't have a specific route
  // This allows stores from the database to be accessible via /store-code/invoice, /store-code/inventory, etc.
  { path: ':storeCode', component: DynamicLayoutComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/print/:id', component: InvoiceComponent, canActivate: [InventoryAuthGuard] },
    { path: 'insurances', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  
  // Catch-all route for undefined paths
  { path: '**', redirectTo: '/home' }
];

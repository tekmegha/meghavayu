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
import { Layout } from './layout/layout';
import { InsurancesComponent } from './insurances/insurances';
import { InvoiceComponent } from './invoice/invoice';
import { InvoiceCreateComponent } from './invoice/invoice-create/invoice-create.component';
import { InvoiceEditComponent } from './invoice/invoice-edit/invoice-edit.component';
import { InvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { InvoicesComponent } from './invoices/invoices';
import { PetCareServicesComponent } from './pet-care-services/pet-care-services';
import { VisakhaVendiHomeComponent } from './visakha-vendi-home/visakha-vendi-home';
import { LayoutFashion } from './layout-fashion/layout-fashion';
import { LayoutToys } from './layout-toys/layout-toys';
import { LayoutDigitalSecurity } from './layout-digitalsecurity/layout-digitalsecurity';
import { LayoutFood } from './layout-food/layout-food';
import { LayoutPetCare } from './layout-pet-care/layout-pet-care';
import { LayoutAcademy } from './layout-academy/layout-academy';
import { LayoutVisakhaVendi } from './layout-visakha-vendi/layout-visakha-vendi';

export const routes: Routes = [
  { path: '', redirectTo: '/megha/home', pathMatch: 'full' },
  
  // Global routes that don't require store context
  { path: 'inventory-login', component: InventoryLogin },
  { path: 'tekmegha-clients', component: TekMeghaClientsComponent},
  
  // Store-specific routes with dynamic layout
  { path: 'megha', component: Layout, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'brew-buddy', component: Layout, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'little-ducks', component: LayoutToys, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'majili', component: LayoutFashion, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'cctv-device', component: LayoutDigitalSecurity, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'royalfoods', component: LayoutFood, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'automobile-insurance', component: Layout, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'dkassociates', component: Layout, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'paws-nexus', component: LayoutPetCare, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  { path: 'fashion', redirectTo: '/majili', pathMatch: 'full' },
  { path: 'toys', redirectTo: '/little-ducks', pathMatch: 'full' },
  { path: 'food', redirectTo: '/royalfoods', pathMatch: 'full' },
  { path: 'insurance', redirectTo: '/automobile-insurance', pathMatch: 'full' },
  { path: 'petcare', redirectTo: '/paws-nexus', pathMatch: 'full' },
  
  // Visakha Vendi routes (Silver Exchange)
  { path: 'visakha-vendi', component: LayoutVisakhaVendi, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: VisakhaVendiHomeComponent },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'stores', component: Stores },
    { path: 'profile', component: Profile },
    { path: 'login', component: Login },
    { path: 'inventory', component: Inventory, canActivate: [InventoryAuthGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice', redirectTo: 'invoices', pathMatch: 'full' },
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  
  // Wildcard route for any store code that doesn't have a specific route
  // This allows stores from the database to be accessible via /store-code/invoice, /store-code/inventory, etc.
  { path: ':storeCode', component: Layout, children: [
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
    { path: 'invoice/new', component: InvoiceCreateComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/edit/:id', component: InvoiceEditComponent, canActivate: [InventoryAuthGuard] },
    { path: 'invoice/view/:id', component: InvoiceViewComponent, canActivate: [InventoryAuthGuard] },
    { path: 'insurances', component: InsurancesComponent, canActivate: [CustomerAuthGuard] },
    { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
  ]},
  
  // Catch-all route for undefined paths
  { path: '**', redirectTo: '/megha/home' }
];

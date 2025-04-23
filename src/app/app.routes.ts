import { Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockComponent } from './stock/stock.component';
import { ReportComponent } from './report/report.component';
import { BillingComponent } from './billing/billing.component';
import { StaffComponent } from './staff/staff.component';
import { SettingComponent } from './setting/setting.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AllRecordsComponent } from './all-records/all-records.component';
import { DefStockComponent } from './def-stock/def-stock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HeaderComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'stock', component: StockComponent },
      { path: 'report', component: ReportComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'add-vendor', component: AddVendorComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'def-stock', component: DefStockComponent },
      { path: 'setting', component: SettingComponent },
      { path: 'all-invoices', component: AllRecordsComponent },
    ],
  },
];

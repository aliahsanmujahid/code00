import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { AuthComponent } from './components/auth/auth.component';
import { AdminGuard } from './_guards/admin.guard';
import { ProductComponent } from './components/product/product.component';
import { ErrorComponent } from './components/error/error.component';
import { SellersComponent } from './components/sellers/sellers.component';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AddeditproductComponent } from './components/addeditproduct/addeditproduct.component';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { ShopComponent } from './shop/shop.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { ProductDetailedResolver } from './_resolvers/product-detailed.resolver';
import { SingleComponent } from './components/single/single.component';

const routes: Routes = [
  {path: '',  component: HomeComponent},
  // {path: 'home',  component: HomeComponent},
  {path: 'adminlogin',  component: AdminloginComponent},
  {path: 'shop',  component: ShopComponent},
  {path: 'auth',  component: AuthComponent},
  {path: 'checkout',  component: CheckoutComponent},
  {path: 'profile',  component: ProfileComponent}, 
  {path: 'order',  component: OrderComponent},
  {path: 'sellers',  component: SellersComponent},
  {path: 'sellerproduct',  component: ProductComponent, canActivate: [AdminGuard]},
  {path: 'error',  component: ErrorComponent},
  {path: 'edit/:id',  component: AddeditproductComponent,canActivate: [AdminGuard]},
  {path: 'product/:id', component: SingleComponent, resolve: {product: ProductDetailedResolver}},
  {path: 'admin',  component: AdminComponent},
  {path: '**', component: HomeComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

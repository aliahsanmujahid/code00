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
  {path: 'shop',  component: ShopComponent},
  {path: 'checkout',  component: CheckoutComponent},
  {path: 'profile',  component: ProfileComponent,canActivate: [AuthGuard]},
  {path: 'order',  component: OrderComponent,canActivate: [AuthGuard]},
  {path: 'sellers',  component: SellersComponent},
  {path: 'sellerproduct',  component: ProductComponent, canActivate: [AdminGuard]},
  {path: 'error',  component: ErrorComponent},
  {path: 'edit/:id',  component: AddeditproductComponent,canActivate: [AuthGuard]},
  {path: 'single/:id', component: SingleComponent, resolve: {product: ProductDetailedResolver}},
  {path: 'admin',  component: AdminComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
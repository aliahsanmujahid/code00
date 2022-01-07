import { OrderService } from './_services/order.service';
import { IBasket, IBasketItem, IBasketTotals } from './_models/basket';
import { CategoryService } from './_services/category.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Model } from './_models/model';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BasketService } from './_services/basket.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  UserId: Number;
  fbmessage = false;
  Activeuser: User;

  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotals>;
  alert = false;
  search:string;
  baseUrl = environment.apiUrl;
  category: any = [];
  subcategory: any = [];
  subsubcategory: any = [];


  constructor(public accountService: AccountService,public categoryService: CategoryService,private toastr: ToastrService,
    private router: Router,public basketService: BasketService,public orderService: OrderService) { }

  ngOnInit(): void {
    
    this.setCurrentUser();

    this.categoryService.getchangeid().subscribe( res =>{
      const cid = JSON.parse(localStorage.getItem('changeid'));
      console.log('Catch Key',res);
      console.log('Local Catch Key',cid);
      if(!cid){
        console.log('Catch Key!!!!!',res);
        localStorage.setItem('changeid', JSON.stringify(res));
      }
      else{
        if(res !== cid){
         localStorage.removeItem('changeid');
         localStorage.removeItem('eidhatcategory');
         localStorage.removeItem('eidhatsubcategory');
         localStorage.removeItem('eidhatsubsubcategory');
         localStorage.removeItem('disupa');
         localStorage.removeItem('utails');
        }
      }

    })

   

    this.QuantityCheck();
    this.getCategoryes();
    this.basketService.getBasket();
    this.basket$ = this.basketService.basket$;
    this.basketTotal$ = this.basketService.basketTotal$;
  
  
  }

  goprofilemobile(){
    this.router.navigateByUrl('profile');
    this.alert = !this.alert;
  }

  goadmin(){
    this.router.navigateByUrl('admin');
    this.alert = !this.alert;
  }
  showmessage(){
    this.fbmessage = !this.fbmessage;
  }
  gosellers(){
    this.router.navigateByUrl('sellers');
    this.alert = !this.alert;
  }
  customerorders(){
    this.router.navigate(['order', {  'codec': this.UserId}]);
  }
  customerordersmobile(){
    this.router.navigate(['order', {  'codec': this.UserId}]);
    this.alert = !this.alert;
  }
  alerttoggle(){
    this.alert = ! this.alert;
  }
  QuantityCheck(){
    const items = JSON.parse(localStorage.getItem('basket'));
    if(items){
      if(this.Activeuser){
        if (this.Activeuser.roles.includes('Admin') 
        || this.Activeuser.roles.includes('Seller') 
        || this.Activeuser.roles.includes('Moderator')){
          this.basketService.deleteBasket();
          this.router.navigateByUrl('');
          this.toastr.warning('You Can,t Buy Product');
        }else{
          this.orderService.orderQuantityCheck(items.items).subscribe(res =>{
            if(res == true){
              this.basketService.deleteBasket();
              this.toastr.info('Product Not Available');
              location.reload();
            }
          })
        }
      }else{
        this.orderService.orderQuantityCheck(items.items).subscribe(res =>{
          if(res == true){
            this.basketService.deleteBasket();
            this.toastr.info('Product Not Available');
            location.reload();
          }
        })
      }
    }
  }

  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }
  
  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('eidhatuser'));
    if(user){
      this.accountService.currentUser$.subscribe( x => {
        if(x){
          this.UserId = x.id;
          this.Activeuser = x;
        }
      });
 
      this.accountService.setUser(user);
    }
  }


  logout() {
    this.accountService.logout();
  }



  getCategoryes(){
    const cate = JSON.parse(localStorage.getItem('eidhatcategory'));
    if(cate){
      this.category = cate;
    }else{
      this.categoryService.getCategories().subscribe( res => {
        this.category = res;
        localStorage.setItem('eidhatcategory', JSON.stringify(res));
      })
    }
  }




  getCatProduct(cate: number){
    this.router.navigate(['shop', {  'v':cate }]);
  
  }
  getsubCatProduct(subcate: number){
    this.router.navigate(['shop', { 'vv':subcate }]);
  }
  searchProduct(){
    this.router.navigate(['shop', { 'search':this.search }]);
  }

  loginpage(){
    this.router.navigate(['auth', {  'login':true }]);
    this.alert = false;
  
  }
  signuppage(){
    this.router.navigate(['auth', {  'signup':true }]);
    this.alert = false;
  }



 
  
}

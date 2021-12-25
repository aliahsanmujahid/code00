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

  @ViewChild('loginRef', {static: false }) loginElement: ElementRef;
  basket$: Observable<IBasket>;
  basketTotal$: Observable<IBasketTotals>;
  alert = false;
  auth2: any;
  search:string;
  baseUrl = environment.apiUrl;
  category: any = [];
  subcategory: any = [];
  subsubcategory: any = [];
  model: Model ={
    username:'',
    email:'',
    image:''
  };

  constructor(public accountService: AccountService,public categoryService: CategoryService,private toastr: ToastrService,
    private router: Router,public basketService: BasketService,public orderService: OrderService) { }

  ngOnInit(): void {
    
    this.setCurrentUser();

    this.categoryService.getchangeid().subscribe( res =>{
     
      const cid = JSON.parse(localStorage.getItem('changeid'));
      if(!cid){
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
    this.router.navigate(['order', {  'customerid': this.UserId}]);
  }
  customerordersmobile(){
    this.router.navigate(['order', {  'customerid': this.UserId}]);
    this.alert = !this.alert;
  }
  alerttoggle(){
    this.alert = ! this.alert;
  }
  QuantityCheck(){
    const items = JSON.parse(localStorage.getItem('basket'));
    if(items){
      if(items.shopId == this.UserId){
        this.basketService.deleteBasket();
        this.router.navigateByUrl('');
        this.toastr.warning('You Can,t Buy Your Own Product');
      }else{
        this.orderService.orderQuantityCheck(items.items).subscribe(res =>{
          if(res == true){
            this.basketService.deleteBasket();
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
        this.UserId = x.id;
      });
      this.accountService.setUser(user);
    }else{
      this.googleInitialize();
    }
  }

  googleInitialize() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '669351671073-ae83o151l8seg7pr0s8rdsvicgbjk3fn.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLogin();
      });
    }
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  prepareLogin() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();

        this.model.username =  profile.getName();
        this.model.email =  profile.getEmail();
        this.model.image =  profile.getImageUrl();

        this.login();


      }, (error) => {
        alert(JSON.stringify("Login Fail By Google"));
      });
  }

  login() {
    this.accountService.login(this.model).subscribe(response => {
    }, error => {
    })
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
    this.router.navigate(['shop', {  'cate':cate }]);
  
  }
  getsubCatProduct(subcate: number){
    this.router.navigate(['shop', { 'subcate':subcate }]);
  }
  searchProduct(){
    this.router.navigate(['shop', { 'search':this.search }]);
  }



 
  
}

import { AccountService } from './../_services/account.service';
import { ProductService } from './../_services/product.service';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BasketService } from '../_services/basket.service';
import { Product } from '../_models/product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  throttle = 0;
  distance = 1;
  page:number = 1;
  showseller = false;

  noproduct:boolean = false;
  stopscroll  = false;
  baseUrl = environment.apiUrl;
  products=[];
  currentRoute: string;
  UserId: Number;
  params: any = {};

  

  constructor(private productService: ProductService,private toastr: ToastrService,
              private route: ActivatedRoute,public accountService: AccountService,
              private router: Router, private basketService: BasketService) { 
              this.products = null;
  }
  
  ngOnInit(): void {
    this.products = [];

    //console.log("nulling product----------");
    //console.log("products----------",this.products);

    this.route.params.subscribe(params => {
       this.noproduct = false;
       this.stopscroll = false;
       window.scrollTo(0, 0);
      // console.log("---------------",this.search);
     // Object.keys(this.search).length === 0 && this.search.constructor === Object
       if (Object.keys(params).length === 0) {
         this.products = [];
         this.getProducts();
         //console.log("geting product----------",this.products);
         //console.log("params null");
       }else{
         this.params = params;
        // console.log("params--------",this.params);
         this.products = [];
         this.paramsproducts(this.params);
       }
       
     });
    this.accountService.currentUser$.subscribe( x => {
      this.UserId = x.id;
    });
  }
  addItemToBasket(item: Product) {
    if(item.appUserId === this.UserId){
      console.log("You Can Not Buy Your Own Product",this.UserId);
      this.toastr.info('You Can,t Buy Your Own Product');
    }else{
      this.basketService.addItemToBasket(item);
    }
  }
  isinBasket(id: number){
    if(this.basketService.getCurrentBasketValue()){
      if(this.basketService.getCurrentBasketValue().items.find(i => i.id == id)){
        return true;
      }else{
        return false; 
      }
    }
  }
  getProducts(){
    this.page = 1;
    this.products = [];
    this.stopscroll = false;
    this.productService.getProducts(this.page).subscribe( res =>{
      this.products = [];
      this.products = res;
     //console.log("geted product",this.products);
     if(this.products.length === 0){
      this.noproduct = true;
    }else{
      this.noproduct = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
  onScroll(): void {
    if(this.stopscroll == false){
    if(this.params.cate){
      this.productService.getcateProducts(this.params.cate,++this.page).subscribe( res =>{
            //console.log("res",res);
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
        console.log(error);
      };
    }else if(this.params.subcate){
      this.productService.getsubcateProducts(this.params.subcate,++this.page).subscribe( res =>{
            console.log("-============res",res.length);
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
        console.log(error);
      };
    }
    else if(this.params.subsubcate){
      this.productService.getsubsubcateProducts(this.params.subsubcate,++this.page).subscribe( res =>{
            //console.log("res",res);
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }
      }),
      error => {
        console.log(error);
      };
    }
    else if(this.params.search){
          // console.log("searching.............",params.search.toLowerCase());
    this.productService.searchProducts(this.params.search,++this.page).subscribe( res =>{
            //console.log("res",res);
            this.products.push(...res);
            if(res.length == 0 || res == null || res.length < 10){
             this.noproduct = true;
             this.stopscroll = true;
            }else{
              this.noproduct = false;
              this.stopscroll = false;
            }    
    }),
    error => {
      console.log(error);
    };
    }else if(this.params.sellername){
          //console.log("sellerparams.............",params);
    this.productService.getuserProducts(this.params.id,++this.page).subscribe( res =>{
      //console.log("res",res);
      this.products.push(...res);
      if(res.length == 0 || res == null || res.length < 10){
       this.noproduct = true;
       this.stopscroll = true;
      }else{
        this.noproduct = false;
        this.stopscroll = false;
      }
    }),
    error => {
      console.log(error);
    };
    }else{
    //console.log("page",++this.page);
    //this.page = this.page++;
    //console.log("page",this.page);
    this.productService
      .getProducts(++this.page).subscribe( res => {
       //console.log("res",res);
       this.products.push(...res);
       if(res.length === 0 || res.length < 10){
        this.noproduct = true;
        this.stopscroll = true;
      }else{
        this.noproduct = false;
        this.stopscroll = false;
      }
       //this.products = res;
      });
    }
  }
  }
  paramsproducts(params){
    this.products = [];
    this.page = 1;
    this.noproduct = false;
    this.stopscroll = false;
  if(params.cate){
    this.productService.getcateProducts(params.cate,this.page).subscribe( res =>{
      this.products = res;
     //console.log("cate-----",this.products);
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
  if(params.subcate){
    this.productService.getsubcateProducts(params.subcate,this.page).subscribe( res =>{
      this.products = res;
     //console.log("subCate----",this.products);
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
  if(params.subsubcate){
    this.productService.getsubsubcateProducts(params.subsubcate,this.page).subscribe( res =>{
      this.products = res;
     //console.log("subCate----",this.products);
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
  if(params.search){
    // console.log("searching.............",params.search.toLowerCase());
    this.productService.searchProducts(params.search,this.page).subscribe( res =>{
      this.products = res;
      //console.log("searching response----",res);
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
  if(params.sellername){
    this.showseller = true;

    //console.log("sellerparams.............",params);
    this.productService.getuserProducts(params.id,this.page).subscribe( res =>{
      this.products = res;
      console.log("sellerproduct response----",res);
     if(this.products.length === 0 || res.length < 10){
      this.noproduct = true;
      this.stopscroll = true;
    }else{
      this.noproduct = false;
      this.stopscroll = false;
    }
    }),
    error => {
      console.log(error);
    };
  }
   
  }


}

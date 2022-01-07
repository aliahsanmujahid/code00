import { FavoriteService } from './../../_services/favorite.service';
import { ProductService } from './../../_services/product.service';
import { BasketService } from './../../_services/basket.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/_models/product';
import { Location } from '@angular/common';
import { AccountService } from 'src/app/_services/account.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.css']
})
export class SingleComponent implements OnInit {

  Activeuser: User;
  fav = false;
  alert = false;
  error = false;
  safeUrl;
  descriptions = [];
  product: Product;
  UserId: Number;
  cartProduct: Product = {
    id: 0,
    appUserId:0,
    sellerName:'',
    name: '',
    description: '',
    highLights: '',
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    youtubeLink: '',
    price: 0,
    discPrice: 0,
    disCount: 0,
    bundel: false,
    quantity: 0,
    colors : [],
    sizes : []
  };

  
  constructor(private route: ActivatedRoute,private basketService: BasketService,
    private favoriteService: FavoriteService,public accountService: AccountService,
    private location: Location,private sanitizer: DomSanitizer,private toastr: ToastrService, 
    public router:Router) { }


  ngOnInit(): void {
    this.accountService.currentUser$.subscribe( x => {
      if(x){
        this.UserId = x.id;
        this.Activeuser = x;
      }
    });
   
    this.route.data.subscribe(data => {
      this.product = data.product;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+ this.product.youtubeLink);
      window.scrollTo(0, 0);
    })



    this.cartProduct = {
    id: this.product.id,
    appUserId: this.product.appUserId,
    sellerName: this.product.sellerName,
    name: this.product.name,
    description: this.product.description,
    highLights: this.product.highLights,
    image1: this.product.image1,
    image2: this.product.image1,
    image3: this.product.image1,
    image4: this.product.image1,
    youtubeLink: this.product.youtubeLink,
    price: this.product.price,
    discPrice: this.product.discPrice,
    quantity: this.product.quantity,
    disCount: this.product.disCount,
    bundel: this.product.bundel,
    colors : [],
    sizes : [],
    };

    this.spliting();
    

  }

  spliting(){
    this.product.description.split('#').forEach(i => {
      this.descriptions.push(i);
    });
  }

  hidealert(){
    this.alert = !this.alert;
  }

  viewseller(id:number){
    this.router.navigate(['shop', { 'id':id }]);
  }
  
  backClick() {
    this.location.back();
  }

  setSize(size, $event){
    if ($event.target.checked){
      this.cartProduct.sizes = [];
      this.cartProduct.sizes.push(size);
      this.alert = false;
    }
    else {
      const index = this.cartProduct.sizes.indexOf(size);
      this.cartProduct.sizes.splice(index, 1);
      
    }
 
  }
  noQuantity(){
    this.toastr.info("No Quantity");
  }

  setColor(color, $event){
    if ($event.target.checked){
      this.cartProduct.colors = [];

      this.cartProduct.colors.push(color);
      this.alert = false;

    }
    else {
      const index = this.cartProduct.colors.indexOf(color);
      this.cartProduct.colors.splice(index, 1);
  
    }

  }
  addItemToBasket(){
    
        if(this.Activeuser){
          if (this.Activeuser.roles.includes('Admin') 
        || this.Activeuser.roles.includes('Seller') 
        || this.Activeuser.roles.includes('Moderator')){
          this.toastr.warning('You Can,t Add Product');
        }else{
    if(this.product.colors.length !== 0 || this.product.sizes.length !== 0){
     if(this.product.colors.length !== 0 && this.cartProduct.colors.length === 0){
       this.alert = !this.alert;
     }
     else if(this.product.sizes.length !== 0 && this.cartProduct.sizes.length === 0){
      this.alert = !this.alert;
    }else{
      this.basketService.addItemToBasket(this.cartProduct);
     }
    }else{
      this.basketService.addItemToBasket(this.cartProduct);
    }        
  }
  }else{
    if(this.product.colors.length !== 0 || this.product.sizes.length !== 0){
      if(this.product.colors.length !== 0 && this.cartProduct.colors.length === 0){
        this.alert = !this.alert;
      }
      else if(this.product.sizes.length !== 0 && this.cartProduct.sizes.length === 0){
       this.alert = !this.alert;
     }else{
       this.basketService.addItemToBasket(this.cartProduct);
      }
     }else{
       this.basketService.addItemToBasket(this.cartProduct);
     }  
        }

  }
 

}

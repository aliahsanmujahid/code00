import { ProductService } from 'src/app/_services/product.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  
  throttle = 0;
  distance = 1;
  UserId: Number;
  products: any = [];
  page = 1;

  noproduct:boolean = false;
  stopscroll = false;

  
  constructor(private productService: ProductService, 
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountService.currentUser$.subscribe( x => {
      if(!x){
         this.router.navigateByUrl('profile');
      }
    });
    this.route.params.subscribe(params => {
      window.scrollTo(0, 0);
    // Object.keys(this.search).length === 0 && this.search.constructor === Object
      if (Object.keys(params).length === 0) {
        this.accountService.currentUser$.subscribe( x => {
          if(x){
            this.UserId = x.id;
          }
          
        });
      }else{
        this.UserId = params.id;
      }
      
    });
    this.getProducts();
  }
  getProducts(){
     this.page = 1;
     this.stopscroll = false;
     this.noproduct = false;
    
      this.productService.getsellerProducts(this.UserId,this.page).subscribe( res =>{
        this.products = res;
        if(res.length == 0 || res == null || res.length < 10){
          this.noproduct = true;
          this.stopscroll = true;
        }else{
          this.noproduct = false;
          this.stopscroll = false;
        }
      }),
      error => {

      };

  }
  deleteProduct(id:number){
    this.productService.deleteProduct(id).subscribe( res =>{
      this.products.splice(this.products.findIndex(m => m.id === id), 1);
    }),
    error => {
    };
  }

  onScroll(): void {
    if(this.stopscroll == false){
      this.productService.getsellerProducts(this.UserId,++this.page).subscribe( res =>{
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

  };
    }
  }



}

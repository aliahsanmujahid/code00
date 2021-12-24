import { ProductService } from './../_services/product.service';
import { Colors, IColors, IProduct, ISizes, Product, Sizes } from './../_models/product';
import { CategoryService } from './../_services/category.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { RoleService } from '../_services/role.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  UserId: Number;
  productview: boolean = true;
  productcreate: boolean = false;
  colors: IColors ={
    colorCode:"#1c03ed",
    name:"",
    quantity:0,
  };
  sizes: ISizes ={
    name:'',
    quantity:0,
  };
  
  isColor:Boolean = false;
  isSize:Boolean = false;
  
   

  getutality: any = [];
  utality: any ={ };

  div1:boolean=false;
  div2:boolean=false;
  div3:boolean=false;
  div4:boolean=false;
  div5:boolean=false;
  div6:boolean=false;
  div7:boolean=false;

  constructor(public accountService: AccountService, 
    public categoryService: CategoryService, 
    public roleService: RoleService,
    public productService: ProductService,
    private router: Router,) { 
    }

  ngOnInit(): void {

    this.getUtails();
    this.accountService.currentUser$.subscribe( x => {
      this.UserId = x.id;
    });
  }



  createView(){
    this.productview = !this.productview;
    this.productcreate = !this.productcreate;
  }
  
  div1Function(){
    this.div1=true;
    this.div2=false;
    this.div3=false;
    this.div4=false
    this.div5=false
    this.div6=false
    this.div7=false
}

div2Function(){
    this.div2=true;
    this.div1=false;
    this.div3=false;
    this.div4=false
    this.div5=false
    this.div6=false
    this.div7=false
   
}

div3Function(){
    this.div3=true;
    this.div2=false;
    this.div1=false
    this.div4=false
    this.div5=false
    this.div6=false
    this.div7=false
}
div4Function(){
  this.div4=true
  this.div1=false
  this.div2=false;
  this.div3=false;
  this.div5=false
  this.div6=false
  this.div7=false
}
div5Function(){
  this.div5=true
  this.div1=false
  this.div2=false;
  this.div3=false;
  this.div4=false;
  this.div6=false;
  this.div7=false;
  this.router.navigate(['order', {  'sellerid': this.UserId}]);
}
div6Function(){
  this.div6=true
  this.div1=false
  this.div2=false;
  this.div3=false;
  this.div4=false
  this.div5=false
  this.div7=false
}
div7Function(){
  this.div7=true
  this.div1=false
  this.div2=false;
  this.div3=false;
  this.div4=false
  this.div5=false
  this.div6=false
}



createUtalitiy(){
  this.categoryService.createUtails(this.utality).subscribe( res => {
    this.getutality = res;
    console.log("utality create----------",res);
  }),
  error => {
    console.log(error);
  };
}
getUtails(){
  const utails = JSON.parse(localStorage.getItem('utails'));
  if(utails){
    this.getutality = utails;
    console.log("utails catch----------",utails);
  }else{
    this.categoryService.getUtails().subscribe( res => {
    this.getutality = res;
    localStorage.setItem('utails', JSON.stringify(res));
    console.log("utails res----------",res);
  })
 }
}



}


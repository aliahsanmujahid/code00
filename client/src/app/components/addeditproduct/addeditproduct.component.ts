import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IColors, IProduct, ISizes } from 'src/app/_models/product';
import { CategoryService } from 'src/app/_services/category.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-addeditproduct',
  templateUrl: './addeditproduct.component.html',
  styleUrls: ['./addeditproduct.component.css']
})
export class AddeditproductComponent implements OnInit {
  

  product: IProduct = {
    id: 0,
    cateId: 0,
    subcateId: 0,
    subsubcateId: 0,
    name: '',
    description: '',
    highLights: '',
    image1:'',
    image2:'',
    image3:'',
    image4:'',
    youtubeLink:'',
    price: 0,
    discPrice: 0,
    disCount: 0,
    bundel: false,
    quantity: 0,
    colors : [],
    sizes : []
  };
  
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
  categoryes: any = [];
  subcategoryes: any = [];
  subsubcategoryes: any = [];
  updateproductId:number;
  
  constructor(public productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public categoryService: CategoryService) { 
      
    }

  ngOnInit(): void {
    this.getmainmenu();
    this.getsubmenu();
    this.getsubsubmenu();

    this.route.params.subscribe(p => {
      if(p.id != 0 && p.id != null){
        this.updateproductId = p.id;
        this.productService.getProduct(p.id).subscribe(res =>{
          this.product = res;
        });
      }

    });
    
    this.product.highLights = 'Good Product#High Febric#Collor Guaranty'
  }

  getmainmenu(){
    this.categoryService.getmainmenu().subscribe( res => {
      this.categoryes = res;
    }),
    error => {
    };
  }
  getsubmenu(){
    this.categoryService.getsubmenu().subscribe( res => {
      this.subcategoryes = res;
    }),
    error => {
    };
  }
  getsubsubmenu(){
    this.categoryService.getsubsubmenu().subscribe( res => {
      this.subsubcategoryes = res;
    }),
    error => {
    };
  }
 
  onCateChange(){
    if(this.product.cateId !== 0 && this.product.cateId !== -1){
      this.categoryService.getsubmenuid(this.product.cateId).subscribe( res => {
        this.subcategoryes = res;
        this.product.subcateId = null;
        this.product.subsubcateId = null;
      }),
      error => {
      };
    }
  }
  onsubCateChange(){
    if(this.product.subcateId !== 0 && this.product.subcateId !== -1){
      this.categoryService.getsubsubmenuid(this.product.subcateId).subscribe( res => {
        this.subsubcategoryes = res;
        this.product.subsubcateId = null;
      }),
      error => {
      };
    }
  }
 

  createProduct(ProductForm: NgForm){

    if(this.product.id == 0){
      if(this.product.image1 !== ''){
        if(ProductForm.valid){
          this.productService.createProduct(this.product).subscribe( res =>{

         }),
         error => {
 
         };
       }
      }else{
      }
    }else{
      if(ProductForm.valid){
        this.productService.updateproduct(this.updateproductId,this.product).subscribe( res =>{

       }),
       error => {

       };
     }
    }
    
}
quantityShow(){
  if(this.product.colors.length !== 0 || this.product.sizes.length !== 0){
     return false;
  }if(this.product.colors.length === 0 || this.product.sizes.length === 0){
    return true;
 }
}
addColors(){
  if(this.product.sizes.length === 0){
    this.isColor = !this.isColor;
  }
  if(this.isSize === true){
    this.isSize = false;
  }
}
addSizes(){
  if(this.product.colors.length === 0){
    this.isSize = !this.isSize;
  }
  if(this.isColor === true){
    this.isColor = false;
  }
}
setColor(){
  this.product.colors.push(this.colors);
  this.colors = {
    colorCode:"#1c03ed",
    name:"",
    quantity: 0
  };
  this.setQuantity();
}
setSize(){
  this.product.sizes.push(this.sizes);
  this.sizes = {
    name:'',
    quantity: 0
  };
  this.setQuantity();
}
setQuantity(){
  if(this.product.colors.length === 0 || this.product.sizes.length === 0){
     this.product.quantity = 0;
  }
  if(this.product.colors.length !== 0){
     this.product.quantity = this.product.colors.reduce((a, b) => (b.quantity) + a, 0);
     return;
  }
  if(this.product.sizes.length !== 0){
    this.product.quantity = this.product.sizes.reduce((a, b) => (b.quantity) + a, 0)
    
 }
}

removeColor(name: String){
   var color =this.product.colors.find.name == name;
   let index = this.product.colors.findIndex(d => d.name === name); //find index in your array
   this.product.colors.splice(index, 1);
   this.setQuantity();
}
removeSize(name: String){
  var color =this.product.sizes.find.name == name;
  let index = this.product.sizes.findIndex(d => d.name === name); //find index in your array
  this.product.sizes.splice(index, 1);
  this.setQuantity();
}

}

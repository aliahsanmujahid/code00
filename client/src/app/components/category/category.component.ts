import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category: any ={ };
  subcategory: any ={ };
  subsubcategory: any ={ };
  categoryes: any = [];
  subcategoryes: any = [];
  subsubcategoryes: any = [];

  constructor( public categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getmainmenu();
    this.getsubmenu();
    this.getsubsubmenu();
  }

  changeMade(){
    this.categoryService.setchangeid().subscribe(res =>{
      console.log("------------------------------------",res);
    });
  }

  createCategory(){
    this.categoryService.creatmenu(this.category).subscribe( res => {
      this.categoryes.push(res);
      // console.log("category----------",res);
    }),
    error => {
      console.log(error);
    };
  }

  


createSubCategory(){
  this.categoryService.creatsubmenu(this.subcategory).subscribe( res => {
    this.subcategoryes.push(res);
    //console.log("Subcategory----------",res);
  }),
  error => {
    console.log(error);
  };
}
createSubSubCategory(){
  this.categoryService.createsubsubmenu(this.subsubcategory).subscribe( res => {
    this.subsubcategoryes.push(res);
  }),
  error => {
    console.log(error);
  };
}
getmainmenu(){
  this.categoryService.getmainmenu().subscribe( res => {
    this.categoryes = res;
    // console.log(res);
  }),
  error => {
    console.log(error);
  };
}
getsubmenu(){
  this.categoryService.getsubmenu().subscribe( res => {
    this.subcategoryes = res;
    // console.log(res);
  }),
  error => {
    console.log(error);
  };
}
getsubsubmenu(){
  this.categoryService.getsubsubmenu().subscribe( res => {
    this.subsubcategoryes = res;
    // console.log(res);
  }),
  error => {
    console.log(error);
  };
}




delete1(id:number){
  this.categoryService.delete1(id).subscribe( res => {
    // this.subsubcategoryes = res;
     //console.log(res);
  }),
  error => {
    console.log(error);
  };
}
delete2(id:number){
  this.categoryService.delete2(id).subscribe( res => {
    // this.subsubcategoryes = res;
     //console.log(res);
  }),
  error => {
    console.log(error);
  };
}
delete3(id:number){
  this.categoryService.delete3(id).subscribe( res => {
    // this.subsubcategoryes = res;
    // console.log(res);
  }),
  error => {
    console.log(error);
  };
}

}

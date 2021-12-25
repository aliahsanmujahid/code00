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
    });
  }

  createCategory(){
    this.categoryService.creatmenu(this.category).subscribe( res => {
      this.categoryes.push(res);
    }),
    error => {
    };
  }

  


createSubCategory(){
  this.categoryService.creatsubmenu(this.subcategory).subscribe( res => {
    this.subcategoryes.push(res);
  }),
  error => {
  };
}
createSubSubCategory(){
  this.categoryService.createsubsubmenu(this.subsubcategory).subscribe( res => {
    this.subsubcategoryes.push(res);
  }),
  error => {
  };
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




delete1(id:number){
  this.categoryService.delete1(id).subscribe( res => {

  }),
  error => {
 
  };
}
delete2(id:number){
  this.categoryService.delete2(id).subscribe( res => {

  }),
  error => {

  };
}
delete3(id:number){
  this.categoryService.delete3(id).subscribe( res => {

  }),
  error => {

  };
}

}

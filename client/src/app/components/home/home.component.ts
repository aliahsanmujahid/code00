import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  category: any = [];
  subcategory: any = [];
  subsubcategory: any = [];
  getutality: any = [];

  constructor(public categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    // this.getCategoryes();
    this.getsubCategoryes();
    this.getUtails();
    this.getsubsubCategoryes();
  }
  getUtails(){
    const utails = JSON.parse(localStorage.getItem('utails'));
    if(utails){
      this.getutality = utails;
    }else{
      this.categoryService.getUtails().subscribe( res => {
      this.getutality = res;
      localStorage.setItem('utails', JSON.stringify(res));
    })
  }
  }

  getsubCategoryes(){
    const cate = JSON.parse(localStorage.getItem('eidhatsubcategory'));
    if(cate){
      this.subcategory = cate;
    }else{
      this.categoryService.getsubmenu().subscribe( res => {
        this.subcategory = res;
        localStorage.setItem('eidhatsubcategory', JSON.stringify(res));
      })
    }
  }
  getsubsubCategoryes(){
    const cate = JSON.parse(localStorage.getItem('eidhatsubsubcategory'));
    if(cate){
      this.subsubcategory = cate;
    }else{
      this.categoryService.getsubsubmenu().subscribe( res => {
        this.subsubcategory = res;
        localStorage.setItem('eidhatsubsubcategory', JSON.stringify(res));
      })
    }
  }

  getCatProduct(cate: number){
    this.router.navigate(['shop', {  'v':cate }]);
  }
  getsubCatProduct(subcate: number){
    this.router.navigate(['shop', { 'vv':subcate }]);
  }
  getsubsubCatProduct(subsubcate: number){
    this.router.navigate(['shop', { 'vvv':subsubcate }]);
  }

  // getCategoryes(){
    
  //   const cate = JSON.parse(localStorage.getItem('eidhatcategory'));
  //   if(cate){
  //     this.category = cate;
  //   }else{
  //     this.categoryService.getCategories().subscribe( res => {
  //       this.category = res;
  //       localStorage.setItem('eidhatcategory', JSON.stringify(res));
  //     })
  //   }
  // }
}

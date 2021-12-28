import { RoleService } from './../../_services/role.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.css']
})
export class SellersComponent implements OnInit {
  
  noseller = false;
  throttle = 0;
  distance = 1;
  page = 1;
  sellers = [];

  constructor(public roleService: RoleService,
    private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      window.scrollTo(0, 0);
    });
    this.getSellers();
  }

  seeorders(id: number){
    this.router.navigate(['order', {  'codes': id}]);
  }
  seeproducts(id: number){
    this.router.navigate(['sellerproduct', {  'id': id}]);
  }

  getSellers(){
    this.page = 1;
    this.noseller = false;
    this.roleService.getSellers(this.page).subscribe(res =>{
         this.sellers = res;

        //  if(res.length == 0 || res.length < 10){
        //   this.noseller = true;
        // }else{
        //   this.noseller = false;
        // }
    });
  }
  ////,'phone':phone
  getsellerProduct(id,sellername,phone){
    this.router.navigate(['shop', { 'id':id , 'sellername':sellername}]);
  }


  onScroll(): void {
    this.noseller = false;
    this.roleService
      .getSellers(++this.page).subscribe( res => {
       this.sellers.push(...res);
      //  if(res.length === 0 || res.length < 10 ){
      //   this.noseller = true;
      // }else{
      //   this.noseller = false;
      // }
       //this.products = res;
      });
  }  

}
